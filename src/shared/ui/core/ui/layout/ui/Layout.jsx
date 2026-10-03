import styled from "@emotion/styled";
import { Button, Layout, Menu, Space, Typography } from "antd";
import Link from "next/link";
import { useRouter } from "next/router";

import { canAccess } from "@/shared/lib/access";

const { Header, Content, Footer } = Layout;

const link = (key, href, label) => ({
  key,
  href,
  label: <Link href={href}>{label}</Link>,
});

const items = [
  {
    key: "entities",
    label: "Entities",
    children: [
      link("teachers", "/teachers", "Teachers"),
      link("subjects", "/subjects", "Subjects"),
      link("classes", "/classes", "Classes"),
      link("periods", "/periods", "Periods"),
      link("school", "/school", "School"),
    ],
  },
  {
    key: "associations",
    label: "Associations",
    children: [
      link("csta", "/csta", "Class-Subject-Teacher association"),
      link("cta", "/cta", "Class-Timetable association"),
    ],
  },
  link("create-timetable", "/create-timetable", "Create timetable"),
  {
    key: "timetables",
    label: "Timetables",
    children: [
      link("class-timetable", "/class-timetable", "Class timetable"),
      link("students-timetable", "/students-timetable", "Students timetable"),
      link("teachers-timetable", "/teachers-timetable", "Teachers timetable"),
    ],
  },
  link("calendar", "/calendar", "Calendar"),
  link("checklists", "/checklists", "Checklists"),
  link("users", "/users", "Users"),
];

// Keeps only the pages the user can open, dropping groups left empty.
const filterItems = (menuItems, currentUser) =>
  menuItems
    .map(({ href, children, ...item }) => {
      if (children) {
        const visible = filterItems(children, currentUser);
        return visible.length > 0 ? { ...item, children: visible } : null;
      }
      return canAccess(href, currentUser) ? item : null;
    })
    .filter(Boolean);

const AppLayout = ({ children, onSignOut, currentUser = {} }) => {
  const router = useRouter();
  return (
    <Layout className="" style={{ minHeight: "100vh" }}>
      <Header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "2rem",
          padding: "2rem",
        }}
      >
        <Title level={4} style={{ margin: 0 }}>
          SchoolDay
        </Title>
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={[router?.pathname?.split("/")[1]]}
          items={filterItems(items, currentUser)}
          style={{
            flex: 1,
            minWidth: 0,
          }}
        />
        <Space>
          {currentUser.email && (
            <Typography.Text style={{ color: "white" }}>
              {currentUser.email}
            </Typography.Text>
          )}
          {onSignOut && <Button onClick={onSignOut}>Sign out</Button>}
        </Space>
      </Header>
      <Content>{children}</Content>
      <Footer
        style={{
          textAlign: "center",
        }}
      >
        SchoolDay ©{new Date().getFullYear()} Created by Fiftytwodays
      </Footer>
    </Layout>
  );
};

export default AppLayout;

const Title = styled.span`
  color: white;
  font-weight: 600;
  font-size: 18px;
  display: inline-block;
  border-radius: 0.4rem;
  margin-right: 1rem;
`;
