import { useState } from "react";
import { Button, Flex, Form, Input, Modal, Select } from "antd";
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";

// An ordered list of `{ id, title }` rows, e.g. checklist items.
function ListField({ field }) {
  const itemLabel = field.itemLabel || "item";

  return (
    <Form.Item label={field.label} extra={field.extra}>
      <Form.List name={field.name}>
        {(listFields, { add, remove, move }) => (
          <Flex vertical gap="small">
            {listFields.map((listField, index) => (
              <Flex key={listField.key} gap="small" align="baseline">
                <Form.Item name={[listField.name, "id"]} hidden noStyle>
                  <Input />
                </Form.Item>
                <Form.Item
                  name={[listField.name, "title"]}
                  rules={[
                    {
                      required: true,
                      whitespace: true,
                      message: `Please enter the ${itemLabel}`,
                    },
                  ]}
                  style={{ flex: 1, marginBottom: 0 }}
                >
                  <Input placeholder={field.placeholder} />
                </Form.Item>
                <Button
                  aria-label="Move up"
                  icon={<ArrowUpOutlined />}
                  disabled={index === 0}
                  onClick={() => move(index, index - 1)}
                />
                <Button
                  aria-label="Move down"
                  icon={<ArrowDownOutlined />}
                  disabled={index === listFields.length - 1}
                  onClick={() => move(index, index + 1)}
                />
                <Button
                  aria-label={`Remove ${itemLabel}`}
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => remove(listField.name)}
                />
              </Flex>
            ))}
            <Button
              type="dashed"
              icon={<PlusOutlined />}
              onClick={() => add({ title: "" })}
            >
              Add {itemLabel}
            </Button>
          </Flex>
        )}
      </Form.List>
    </Form.Item>
  );
}

// Form.Item passes value, onChange and status props to its direct child, so
// they must be forwarded to the actual input.
function FieldInput({ field, ...inputProps }) {
  if (field.type === "select") {
    return (
      <Select
        {...inputProps}
        showSearch
        allowClear={!field.required}
        mode={field.mode}
        optionFilterProp="label"
        options={field.options}
        placeholder={field.placeholder}
        disabled={field.disabled}
      />
    );
  }
  if (field.type === "textarea") {
    return (
      <Input.TextArea
        {...inputProps}
        rows={3}
        placeholder={field.placeholder}
        disabled={field.disabled}
      />
    );
  }
  return (
    <Input
      {...inputProps}
      placeholder={field.placeholder}
      disabled={field.disabled}
    />
  );
}

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
        {fields.map((field) =>
          field.type === "list" ? (
            <ListField key={field.name} field={field} />
          ) : (
            <Form.Item
              key={field.name}
              name={field.name}
              label={field.label}
              extra={field.extra}
              rules={field.rules}
              initialValue={field.initialValue}
            >
              <FieldInput field={field} />
            </Form.Item>
          )
        )}
      </Form>
    </Modal>
  );
}

export default EntityFormModal;
