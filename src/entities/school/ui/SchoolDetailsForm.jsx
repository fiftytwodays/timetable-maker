import { useState } from "react";
import { Button, Form, Input, Upload, theme, Space, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { mutate } from "swr";

import { getImageUrl } from "../lib/get-image-url";
import { updateSchoolInfo } from "../api/update-school-info";

const SchoolDetailsForm = ({ data, setIsEditing }) => {
  const { token } = theme.useToken();
  const [form] = Form.useForm();

  const [logo, setLogo] = useState({
    uid: "-1",
    name: data?.logo,
    status: "done",
    url: getImageUrl(data),
  });

  const onFinish = async (values) => {
    const saveResult = await updateSchoolInfo(data?.id, {
      ...values,
      logo: values?.logo[0]?.originFileObj || null,
    });

    mutate(["/api/school"]);

    if (saveResult?.collectionId) {
      showMessage("success", "Details updated!");
    } else {
      showMessage("error", saveResult?.message);
    }
    setIsEditing(false);
  };

  const onCancel = () => {
    form.resetFields();
    setIsEditing(false);
  };

  const formInitialValues = {
    name: data?.name,
    address: data?.address,
    email: data?.email,
    contact: data?.contact,
    phone: data?.phone,
    logo: getImageUrl(data),
  };

  const onRemoveLogo = () => {
    setLogo(null);
  };

  const onAddLogo = ({ file }) => {
    if (file?.status !== "removed") {
      setLogo(file);
    }
  };

  return (
    <Form
      name="basic"
      initialValues={formInitialValues}
      {...layout}
      labelCol={{
        span: 8,
      }}
      wrapperCol={{
        span: 16,
      }}
      style={{
        maxWidth: 600,
      }}
      onFinish={onFinish}
      autoComplete="off"
      form={form}
    >
      <Form.Item
        label="Name"
        name="name"
        rules={[
          {
            required: true,
            message: "Please input the school name!",
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="logo"
        label="Logo"
        valuePropName="logo"
        getValueFromEvent={normFile}
      >
        <Upload
          listType="picture-card"
          fileList={logo?.name ? [logo] : []}
          onRemove={onRemoveLogo}
          onChange={onAddLogo}
        >
          {!logo?.name && (
            <button
              style={{ border: 0, background: "none", color: token.colorText }}
              type="button"
            >
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>Upload</div>
            </button>
          )}
        </Upload>
      </Form.Item>

      <Form.Item label="Address" name="address">
        <Input />
      </Form.Item>
      <Form.Item
        label="Email"
        name="email"
        rules={[
          {
            type: "email",
            message: "Please enter a valid email address!",
          },
          {
            required: true,
            message: "Please enter your email!",
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Phone"
        name="phone"
        rules={[
          {
            required: true,
            message: "Please input your Phone!",
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Contact"
        name="contact"
        rules={[
          {
            required: true,
            message: "Please input your Contact!",
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item {...tailLayout}>
        <Space>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
          <Button htmlType="button" onClick={onCancel}>
            Cancel
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

const showMessage = (type = "info", content = "") => {
  message.open({
    type: type,
    content: content,
  });
};

const layout = {
  labelCol: {
    span: 16,
  },
  wrapperCol: {
    span: 16,
  },
};
const tailLayout = {
  wrapperCol: {
    offset: 8,
    span: 16,
  },
};

const normFile = (e) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
};

export default SchoolDetailsForm;
