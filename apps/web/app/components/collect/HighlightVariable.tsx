import { Highlight, HighlightProps } from "@mantine/core";
import { loader } from "~/routes/build.$formId";
import { useLoaderData } from "@remix-run/react";
import { useEffect, useState } from "react";

const HighlightVariable = (props: HighlightProps) => {
  const [highlight, setHighlights] = useState<string[]>([]);
  const { form } = useLoaderData<typeof loader>();
  useEffect(() => {
    if (form?.variables && Array.isArray(props.highlight)) {
      const variables = form?.variables.map((variable) => variable.label);

      setHighlights(
        props.highlight?.filter((item) =>
          variables.includes(item.replace(/[{}]/g, "")),
        ),
      );
    }
  }, [form?.variables, props.children]);
  return (
    <Highlight {...props} highlight={highlight}>
      {props.children}
    </Highlight>
  );
};

export default HighlightVariable;
