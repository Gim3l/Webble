import { Stack, Textarea, Text, TextInput } from "@mantine/core";
import ElementWrapper from "./ElementWrapper";

import { elementsConfig, ScriptLogicGroupElement } from "@webble/elements";
import { updateGroupElement } from "~/components/collect/store";

function ScriptLogicElement(element: ScriptLogicGroupElement) {
  return (
    <ElementWrapper
      icon={elementsConfig[element.type].icon}
      groupId=""
      element={element}
      configEl={
        <>
          <Stack gap="sm">
            <TextInput
              label="Name"
              placeholder="Enter script name"
              variant="filled"
              defaultValue={element.data.name}
              onChange={(e) => {
                updateGroupElement<ScriptLogicGroupElement>({
                  ...element,
                  data: { ...element.data, name: e.currentTarget.value },
                });
              }}
            />
            <Textarea
              label={"Script"}
              autosize
              minRows={4}
              defaultValue={element.data.code}
              onChange={(e) => {
                updateGroupElement<ScriptLogicGroupElement>({
                  ...element,
                  data: { ...element.data, code: e.currentTarget.value },
                });
              }}
            ></Textarea>
          </Stack>
        </>
      }
    >
      <Text c={"gray"}>{element.data.name}</Text>
    </ElementWrapper>
  );
}

export default ScriptLogicElement;
