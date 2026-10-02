import { useState } from "react";
import { Form, Input, Modal, Select } from "antd";

function EntityFormModal({
  open,
  title,
  fields = [],
  initialValues,
  onSubmit,
  onCancel,
}) {
  const [form] = Form.useForm();
  const [isSaving, setIsSaving] = useState(false);

  const onFinish = async (values) => {
    setIsSaving(true);
    try {
      await onSubmit(values);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal
      open={open}
      title={title}
      okText="Save"
      onOk={() => form.submit()}
      onCancel={onCancel}
      confirmLoading={isSaving}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        preserve={false}
        initialValues={initialValues}
        onFinish={onFinish}
        autoComplete="off"
      >
        {fields.map((field) => (
          <Form.Item
            key={field.name}
            name={field.name}
            label={field.label}
            extra={field.extra}
            rules={field.rules}
          >
            {field.type === "select" ? (
              <Select
                showSearch
                optionFilterProp="label"
                options={field.options}
                placeholder={field.placeholder}
              />
            ) : (
              <Input placeholder={field.placeholder} />
            )}
          </Form.Item>
        ))}
      </Form>
    </Modal>
  );
}

export default EntityFormModal;
