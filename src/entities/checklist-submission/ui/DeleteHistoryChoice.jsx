import { useState } from "react";
import { Checkbox, Flex, Typography } from "antd";

/**
 * Whether to also delete the submissions when deleting a teacher or a
 * checklist, chosen per record. Unticked, they are kept as history.
 */
export const useDeleteHistoryChoice = () => {
  const [choices, setChoices] = useState({});

  return {
    shouldDelete: (id) => Boolean(choices[id]),
    setShouldDelete: (id, value) =>
      setChoices((current) => ({ ...current, [id]: value })),
  };
};

/** The delete confirmation text, with the choice when there is history. */
export function DeleteDescription({ question, count, checked, onChange }) {
  if (!count) {
    return question;
  }
  return (
    <Flex vertical gap={4} style={{ maxWidth: 320 }}>
      <span>{question}</span>
      <Checkbox
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      >
        Also delete {count} checklist submission{count === 1 ? "" : "s"}
      </Checkbox>
      <Typography.Text type="secondary">
        {checked
          ? "The submissions are deleted permanently."
          : "The submissions are kept as history for admins."}
      </Typography.Text>
    </Flex>
  );
}
