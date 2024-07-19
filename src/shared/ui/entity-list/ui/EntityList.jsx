import { Table, Space } from "antd";
import styled from "@emotion/styled";

import mapToAntDColumns from "../lib/map-to-antd-columns";

export default function EntityList({
  componentRef = null,
  columns = [],
  data = [],
  rowKey = "id",
  totalCount = 0,
  pageNo = 1,
  setPageNo,
  pageSize = 10,
  setPageSize,
  setSort = () => {},
  toolbarExtensions = [],
  showToolbar = false,
  isPaginationVisible = false,
  isRowSelectionVisible = false,
  isBordered = false,
  isLoading = false,
  title,
}) {
  const visibleColumns = columns.filter((column) => !column.hidden);

  const setSortValue = (sorter) => {
    const sortOrder = sorter.order === "ascend" ? "asc" : "desc";
    const sortField = Array.isArray(sorter.field)
      ? sorter.field.join(".")
      : sorter.field;

    const sortValue = sorter.order ? `${sortField},${sortOrder}` : undefined;

    setSort(sortValue);
  };

  return (
    <>
      {showToolbar && (
        <TableToolbar>
          <Space size="middle">
            <>
              {toolbarExtensions.map((extension, idx) => {
                return <Extension key={idx}>{extension}</Extension>;
              })}
            </>
          </Space>
        </TableToolbar>
      )}
      <div ref={componentRef}>
        <Table
          title={() => {
            return title;
          }}
          loading={isLoading}
          bordered={isBordered}
          columns={mapToAntDColumns(visibleColumns)}
          dataSource={data}
          rowKey={rowKey}
          rowSelection={
            isRowSelectionVisible && {
              type: "checkbox",
            }
          }
          onChange={(pagination, _, sorter) => {
            setSortValue(sorter);
            setPageNo(pagination.current - 1);
          }}
          pagination={
            isPaginationVisible && {
              total: totalCount,
              showSizeChanger: true,
              pageSizeOptions: ["10", "15", "20", "25"],
              pageSize,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} of ${total} items`,
              onShowSizeChange: (_, size) => setPageSize(size),
              current: pageNo + 1,
            }
          }
          scroll={{
            x: 1,
          }}
        ></Table>
      </div>
    </>
  );
}

const Extension = styled.div``;

const TableToolbar = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 16px 0;
`;
