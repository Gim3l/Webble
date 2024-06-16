import { getQuickJS } from "quickjs-emscripten";

export async function runScript(code: string, values: Record<string, any>) {
  try {
    const wrappedCode = `
        async function run() {
            await fetch("");
            ${code}
        }
        run();
      `;
    // getQuickJS()
    // .then(async (QuickJs) => {
    const QuickJs = await getQuickJS();

    console.log("Creating script runner...");
    const vm = QuickJs.newContext({});

    let interruptCycles = 0;
    vm.runtime.setMemoryLimit(1024 * 640);
    vm.runtime.setMaxStackSize(1024 * 640);
    vm.runtime.setInterruptHandler(() => ++interruptCycles > 1024);

    vm.newFunction("setVariableValue", (...args) => {
      const nativeArgs = args.map(vm.dump);
      const [name, value] = nativeArgs;

      if (typeof value !== "string" && typeof value !== "number") return;

      if (values[name]) {
        values[name].value = value;
      } else {
        values[name] = { type: "variable", value };
      }
    }).consume((handle) => vm.setProp(vm.global, "setVariableValue", handle));

    const fetchHandle = vm.newFunction("fetch", (urlHandle) => {
      const url = vm.getString(urlHandle);
      const promise = vm.newPromise();

      fetch(url)
        .then((res) => res.text())
        .then((txt) => {
          promise.resolve(vm.newString(txt || ""));
        });

      promise.settled.then(() => {
        vm.runtime.executePendingJobs();
      });

      // return promise.handle;
    });

    // const fetchHandle = vm.newFunction("fetch", (...args) => {
    //   const [input, init] = args.map(vm.dump);
    //   const deferred = vm.newPromise();
    //
    //   fetch(input, init).then((result) => {
    //     result.text().then((text) => {
    //       deferred.resolve(vm.newString(text));
    //     });
    //   });
    //
    //   deferred.settled.then(vm.runtime.executePendingJobs);
    //   return deferred.handle;
    // });

    fetchHandle.consume((handle) => vm.setProp(vm.global, "fetch", handle));

    // vm.runtime.setMemoryLimit(1024 * 1024 * 20); // 2 MB;

    const result = vm.unwrapResult(vm.evalCode(wrappedCode));

    console.log("Has pending job?", vm.getPromiseState(result).type);
    const state = vm.getPromiseState(result);
    if (state.type === "fulfilled" && state.notAPromise) {
      //
      console.log("it' s not a promise");
    } else {
      try {
        const resultPromise = await vm.resolvePromise(result);

        // console.log({ result });
        if (resultPromise.error) {
          console.log("Execution failed:", vm.dump(resultPromise.error));
          resultPromise.error.dispose();
        } else {
          console.log("Success:", vm.dump(resultPromise.value));
          resultPromise.value.dispose();
        }
      } catch (err) {
        console.log("Error:", err);
      }
    }

    // }

    result.dispose();
    vm.dispose();
  } catch (err) {
    console.log(err);
  }
}
