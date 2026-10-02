import { Modal, Typography } from "antd";

const { Paragraph, Text } = Typography;

/**
 * Shows a temporary password once, so the admin can hand it to the user.
 * It cannot be retrieved again; resetting the password makes a new one.
 */
export const showTemporaryPassword = ({ username, email, temporaryPassword }) =>
  Modal.success({
    title: `Temporary password for ${username}`,
    width: 480,
    content: (
      <>
        <Paragraph>
          Give these details to the user. They must choose a new password the
          first time they sign in.
        </Paragraph>
        <Paragraph>
          Username: <Text strong copyable>{username}</Text>
        </Paragraph>
        <Paragraph>
          Temporary password:{" "}
          <Text strong code copyable>
            {temporaryPassword}
          </Text>
        </Paragraph>
        <Paragraph type="secondary">
          {email
            ? `An invitation was also emailed to ${email}.`
            : "This password is only shown now. If it is lost, reset the password to get a new one."}
        </Paragraph>
      </>
    ),
  });
