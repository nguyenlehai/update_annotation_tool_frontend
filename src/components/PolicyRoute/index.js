import { message } from "antd";
import { ROUTES } from "configs";
import { AppContext } from "index";
import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { Route, Redirect } from "react-router-dom";

/**
 * Component phân quyền dựa trên giá trị role của user thông qua ContextAPI và giá trị roles được configs ở file screens/index.js
 * props.roles nhận giá trị là mảng nếu chấp nhận nhiều cấp người dùng, string nếu chỉ cho 1 cấp người dùng hoặc null nếu component public
 * Nếu props.roles là mảng rỗng, tất cả người dùng đã đăng nhập có thể truy cập
 * Trong trường hợp người dùng đã đăng nhập, sẽ tự động quay về màn hình Home
 * Trong trường hợp người dùng chưa đăng nhập mà vào trang không public sẽ được quay lại trang đăng nhập, path của component
 * người dùng muốn vào lưu ở trong state của route với trường from
 * @param {import("react-router-dom").RouteProps} props
 */
const PolicyRoute = (props) => {
  const { t } = useTranslation();
  const [{ user }] = useContext(AppContext);

  if (props.roles) {
    if (user?.role && Number(user?.exp || 0) > Math.floor(Date.now() / 1000)) {
      if (
        props.role === user.role ||
        (Array.isArray(props.roles) && !props.roles.length) ||
        (Array.isArray(props.roles) && props.roles.includes(user.role))
      ) {
        return <Route {...props} />;
      }

      message.warning(t("Messages.PermissionDenied"));
      return (
        <Route
          {...props}
          component={() => (
            <Redirect
              to={{
                pathname: ROUTES.HOME,
                state: {
                  from: props.path,
                },
              }}
            />
          )}
        />
      );
    }
    return (
      <Route
        {...props}
        component={() => (
          <Redirect
            to={{
              pathname: ROUTES.HOME,
              state: {
                from: props.path,
              },
            }}
          />
        )}
      />
    );
  }
  if (!user?.role || Number(user?.exp || 0) <= Math.floor(Date.now() / 1000)) {
    return <Route {...props} />;
  }
  return (
    <Route
      {...props}
      component={() => (
        <Redirect
          to={{
            pathname: ROUTES.HOME,
          }}
        />
      )}
    />
  );
};

export default PolicyRoute;
