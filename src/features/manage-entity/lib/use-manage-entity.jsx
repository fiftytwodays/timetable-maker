import { useState } from "react";
import { Button, Popconfirm, Space, message } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { mutate } from "swr";

import EntityFormModal from "../ui/EntityFormModal";

const trimValues = (values) =>
  Object.fromEntries(
    Object.entries(values).map(([key, value]) => [
      key,
      typeof value === "string" ? value.trim() : value,
    ])
  );

const requiredRuleType = (field) => {
  if (field.mode === "multiple") {
    return "array";
  }
  return field.type ? "any" : "string";
};

// Names are shown across timetables and lookups, so revalidate every list.
const revalidateAll = () => mutate(() => true);

/**
 * Adds create, edit and delete to an entity list. Returns the toolbar button,
 * an actions column for the table and the form modal to render.
 *
 * Field options: `required`, `unique`, `rules`, `type` ("select",
 * "textarea", "time" or "list"), `hiddenOnCreate`, `disabledOnEdit` and
 * `hiddenWhen(values)`, which hides (and skips submitting) the field.
 * `createRecord(values, initialValues)`, `updateRecord(id, values, record)`
 * and `deleteRecord(id, record)` also receive the record being changed.
 * `extraActions(record)` adds row buttons and `getDeleteDescription(record)`
 * replaces the delete confirmation text. `openCreate(initialValues)` and
 * `openEdit(record)` open the form from elsewhere.
 */
export default function useManageEntity({
  entityName,
  fields,
  getRecords,
  createRecord,
  updateRecord,
  deleteRecord,
  getRecordLabel = (record) => record.name,
  extraActions,
  getDeleteDescription = (record) => `Delete "${getRecordLabel(record)}"?`,
}) {
  // null: modal closed, {}: creating, record: editing
  const [editingRecord, setEditingRecord] = useState(null);
  // Changes on every opening so the form starts from the record's values.
  const [formKey, setFormKey] = useState(0);
  const label = entityName.toLowerCase();
  const isEditing = Boolean(editingRecord?.id);

  const openForm = (record) => {
    setEditingRecord(record);
    setFormKey((key) => key + 1);
  };

  const visibleFields = fields.filter(
    (field) => isEditing || !field.hiddenOnCreate
  );

  const formFields = visibleFields.map((field) => ({
    ...field,
    disabled: isEditing && field.disabledOnEdit,
    rules: [
      ...(field.required
        ? [
            {
              required: true,
              // The validator assumes text unless told otherwise, which
              // rejects boolean select values such as Enabled/Disabled.
              type: requiredRuleType(field),
              whitespace: !field.type,
              message: `Please ${
                field.type === "select" ? "select" : "enter"
              } the ${field.label.toLowerCase()}`,
            },
          ]
        : []),
      ...(field.rules || []),
      ...(field.unique
        ? [
            {
              validator: async (_, value) => {
                const normalized = value?.trim().toLowerCase();
                if (!normalized) {
                  return;
                }
                const records = await getRecords();
                const isTaken = records.some(
                  (record) =>
                    record.id !== editingRecord?.id &&
                    record[field.name]?.trim().toLowerCase() === normalized
                );
                if (isTaken) {
                  throw new Error(
                    `A ${label} with this ${field.label.toLowerCase()} already exists`
                  );
                }
              },
            },
          ]
        : []),
    ],
  }));

  const onSubmit = async (values) => {
    try {
      if (isEditing) {
        await updateRecord(editingRecord.id, trimValues(values), editingRecord);
        message.success(`${entityName} updated!`);
      } else {
        await createRecord(trimValues(values), editingRecord);
        message.success(`${entityName} created!`);
      }
      setEditingRecord(null);
      revalidateAll();
    } catch (error) {
      message.error(error.message);
    }
  };

  const onDelete = async (record) => {
    try {
      await deleteRecord(record.id, record);
      message.success(`${entityName} deleted!`);
      revalidateAll();
    } catch (error) {
      message.error(
        `Could not delete "${getRecordLabel(record)}". ${error.message}`
      );
    }
  };

  const addButton = (
    <Button
      type="primary"
      icon={<PlusOutlined />}
      onClick={() => openForm({})}
    >
      Add {label}
    </Button>
  );

  const actionsColumn = {
    title: "Actions",
    key: "actions",
    width: extraActions ? 340 : 200,
    render: (_, record) => (
      <Space>
        {extraActions?.(record)}
        <Button
          size="small"
          icon={<EditOutlined />}
          onClick={() => openForm(record)}
        >
          Edit
        </Button>
        <Popconfirm
          title={`Delete ${label}`}
          description={getDeleteDescription(record)}
          okText="Delete"
          okButtonProps={{ danger: true }}
          onConfirm={() => onDelete(record)}
        >
          <Button size="small" danger icon={<DeleteOutlined />}>
            Delete
          </Button>
        </Popconfirm>
      </Space>
    ),
  };

  const formModal = (
    <EntityFormModal
      open={editingRecord !== null}
      title={isEditing ? `Edit ${label}` : `Add ${label}`}
      fields={formFields}
      initialValues={editingRecord || {}}
      formKey={formKey}
      onSubmit={onSubmit}
      onCancel={() => setEditingRecord(null)}
    />
  );

  return {
    addButton,
    actionsColumn,
    formModal,
    openCreate: (initialValues = {}) => openForm(initialValues),
    openEdit: openForm,
  };
}
