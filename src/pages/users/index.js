import { Page } from "@/shared/ui/page";
import { UsersList } from "@/widgets/users-list";

function Users() {
  return (
    <Page
      showPageHeader
      header={{
        title: "Users",
        breadcrumbs: [
          {
            title: "Home",
          },

          {
            title: "Users",
          },
        ],
      }}
      content={<UsersList />}
    ></Page>
  );
}

export default Users;
