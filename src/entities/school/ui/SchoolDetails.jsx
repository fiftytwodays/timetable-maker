import { Descriptions, Skeleton, Button, Space } from "antd";
import useSWR from "swr";

import { getSchoolInfo } from "../api/get-school-info";
import styled from "@emotion/styled";
import { useState } from "react";
import SchoolDetailsForm from "./SchoolDetailsForm";
import Image from "next/image";
import { getImageUrl } from "../lib/get-image-url";

function SchoolDetails() {
  const [isEditing, setIsEditing] = useState(false);
  const { data, isLoading } = useSWR(["/api/school"], getSchoolInfo);

  const descriptionItems = generateDescriptionItems(data?.[0]);

  const onEditing = () => {
    setIsEditing(true);
  };

  return (
    <Skeleton loading={isLoading} active>
      {isEditing ? (
        <SchoolDetailsForm data={data?.[0]} setIsEditing={setIsEditing} />
      ) : (
        <_Space direction="vertical">
          <Button onClick={onEditing}>Edit details</Button>
          <Descriptions column={1} bordered items={descriptionItems} />
        </_Space>
      )}
    </Skeleton>
  );
}

function generateDescriptionItems(data) {
  const imageURL = getImageUrl(data);
  const items = [
    {
      key: "1",
      label: "Name",
      children: data?.name,
    },
    {
      key: "2",
      label: "Logo",
      children: imageURL && (
        <Image src={imageURL} alt="logo" width={100} height={100} />
      ),
    },
    {
      key: "3",
      label: "Address",
      children: data?.address,
    },
    {
      key: "4",
      label: "Phone",
      children: data?.phone,
    },
    {
      key: "5",
      label: "Email",
      children: data?.email,
    },
    {
      key: "6",
      label: "Contact",
      children: data?.contact,
    },
  ];

  return items;
}
export default SchoolDetails;

const _Space = styled(Space)`
  display: flex;
`;
