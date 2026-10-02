import { Modal, message } from "antd";
import { mutate } from "swr";

import { resetUserPassword } from "@/entities/user/api/mutate-user";

import { showTemporaryPassword } from "./show-temporary-password";

/** Asks for confirmation, then sets and shows a new temporary password. */
export const confirmResetPassword = (user) =>
  Modal.confirm({
    title: `Reset password for ${user.username}?`,
    content:
      "A new temporary password is created and shown to you. The user must change it at their next sign-in.",
    okText: "Reset password",
    onOk: async () => {
      try {
        const temporaryPassword = await resetUserPassword(user.id);
        showTemporaryPassword({ username: user.username, temporaryPassword });
        mutate(() => true);
      } catch (error) {
        message.error(error.message);
      }
    },
  });
