import { InputLabel, Stack, TypographyStylesProvider } from "@mantine/core";
import { Highlight } from "@tiptap/extension-highlight";
import { Link, RichTextEditor } from "@mantine/tiptap";
import ElementWrapper from "./ElementWrapper";

import {
  elementsConfig,
  GroupElement,
  TYPE_TEXT_BUBBLE_ELEMENT,
} from "@webble/elements";
import { updateGroupElement } from "~/components/collect/store";
import { useEditor } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import { Underline } from "@tiptap/extension-underline";

function TextBubbleElement(
  element: GroupElement<typeof TYPE_TEXT_BUBBLE_ELEMENT>,
) {
  const editor = useEditor({
    content: element.data.text,
    extensions: [
      StarterKit,
      Underline,
      Link,
      Highlight,
      // TextAlign.configure({ types: ['heading', 'paragraph'] }),
    ],
    onUpdate({ editor }) {
      updateGroupElement<typeof TYPE_TEXT_BUBBLE_ELEMENT>({
        ...element,
        data: { ...element.data, text: editor.getHTML() },
      });
    },
  });

  return (
    <ElementWrapper
      icon={elementsConfig[element.type].icon}
      groupId=""
      element={element}
      configEl={
        <>
          <Stack gap="sm">
            <InputLabel>Content</InputLabel>
            <RichTextEditor editor={editor} variant={"light"}>
              <RichTextEditor.Content />
              <RichTextEditor.Toolbar sticky stickyOffset={60}>
                <RichTextEditor.ControlsGroup>
                  <RichTextEditor.Bold />
                  <RichTextEditor.Italic />
                  <RichTextEditor.Underline />
                  <RichTextEditor.Strikethrough />
                  <RichTextEditor.ClearFormatting />
                  <RichTextEditor.Highlight />
                  <RichTextEditor.Code />
                </RichTextEditor.ControlsGroup>

                <RichTextEditor.ControlsGroup>
                  <RichTextEditor.Link />
                  <RichTextEditor.Unlink />
                </RichTextEditor.ControlsGroup>
              </RichTextEditor.Toolbar>
            </RichTextEditor>
          </Stack>
        </>
      }
    >
      <TypographyStylesProvider c={"gray"}>
        <div
          dangerouslySetInnerHTML={{
            __html: element.data.text || "<p>Enter something...</p>",
          }}
        />
      </TypographyStylesProvider>
    </ElementWrapper>
  );
}

export default TextBubbleElement;
