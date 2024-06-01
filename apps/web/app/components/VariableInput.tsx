import { Editor, EditorContent, useEditor } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import "@mantine/tiptap/styles.css";

import { Link, RichTextEditor } from "@mantine/tiptap";
import { Underline } from "@tiptap/extension-underline";
import { Highlight } from "@tiptap/extension-highlight";
import {
  ActionIcon,
  Combobox,
  TextInput,
  TextInputProps,
  useCombobox,
} from "@mantine/core";
import { useCallback, useEffect, useMemo, useState } from "react";
import { IconVariable } from "@tabler/icons-react";
import { useLoaderData } from "@remix-run/react";
import { loader } from "~/routes/build.$formId";

function VariableInput(
  props: TextInputProps & { onOptionSubmit: (value: string) => void },
) {
  const { form } = useLoaderData<typeof loader>();
  // const [opened, setOpened] = useState(false);

  const combobox = useCombobox({
    onDropdownClose: () => {
      combobox.focusTarget();
      combobox.resetSelectedOption();
      setSearch("");
    },
    onDropdownOpen: () => {
      combobox.focusSearchInput();
    },
  });
  const [search, setSearch] = useState("");

  const options = useMemo(
    () =>
      form?.variables
        .map((variable) => variable.label)
        .filter((item) =>
          item.toLowerCase().includes(search.toLowerCase().trim()),
        )
        .map((item) => (
          <Combobox.Option value={item} key={item}>
            {item}
          </Combobox.Option>
        )),
    [form?.variables, search],
  );

  useEffect(() => {
    // we need to wait for options to render before we can select first one
    combobox.selectFirstOption();
  }, [search]);

  const handleInputKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      console.log(e.currentTarget.value);
      if (e.key === "{") {
        combobox.openDropdown();
      }
    },
    [],
  );

  return (
    <>
      <Combobox
        store={combobox}
        transitionProps={{ transition: "pop", duration: 200 }}
        onOptionSubmit={(val) => {
          combobox.closeDropdown();
          if (!combobox.targetRef.current) return;
          // insert value at cursor
          const target = combobox.targetRef.current as HTMLInputElement;
          const cursorPosition = target.selectionStart!;
          const textBeforeCursorPosition = target.value.substring(
            0,
            cursorPosition,
          );
          const textAfterCursorPosition = target.value.substring(
            cursorPosition,
            target.value.length,
          );

          const prefix = textBeforeCursorPosition.endsWith("{") ? "" : "{";

          const variable = textAfterCursorPosition.startsWith("}")
            ? prefix + val
            : prefix + val + "}";

          const value =
            textBeforeCursorPosition + variable + textAfterCursorPosition;
          target.value = value;
          props.onChange && props.onOptionSubmit(value);

          target.selectionStart = target.selectionEnd =
            cursorPosition + variable.length;
        }}
      >
        <Combobox.Target>
          <TextInput
            rightSection={
              <ActionIcon
                size={"sm"}
                color={"gray"}
                onClick={() => {
                  combobox.openDropdown();
                }}
              >
                <IconVariable />
              </ActionIcon>
            }
            onKeyDown={handleInputKeyDown}
            {...props}
          />
        </Combobox.Target>

        <Combobox.Dropdown
          onKeyDown={(e) => {
            if (combobox.dropdownOpened) {
              // listen for ctrl + p combination
              if (e.ctrlKey && e.key === "n") {
                e.preventDefault();
                combobox.selectNextOption();
              }
              if (e.ctrlKey && e.key === "p") {
                e.preventDefault();
                combobox.selectPreviousOption();
              }
            }
          }}
        >
          <Combobox.Search
            value={search}
            onChange={(event) => setSearch(event.currentTarget.value)}
            placeholder="Search variables"
          />
          <Combobox.Options>{options}</Combobox.Options>
        </Combobox.Dropdown>
      </Combobox>
    </>
  );
}

export default VariableInput;
