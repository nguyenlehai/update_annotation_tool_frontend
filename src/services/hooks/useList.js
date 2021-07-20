import { useCallback, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import querystring from "querystring";

const useList = ({ apiLoadList, didLoadList }) => {
  const history = useHistory();
  const currentQuery = useRef({});
  const [list, setList] = useState({
    dataSource: [],
    loading: false,
    pagination: {
      current: 1,
      total: 0,
      pageSize: 20,
    },
  });

  const putURLQuery = useCallback((query) => {
    history.replace({
      ...history.location,
      search: querystring.stringify({
        query: JSON.stringify(query),
      }),
    });
    // eslint-disable-next-line
  }, []);

  const loadList = useCallback(
    async (query) => {
      if (typeof apiLoadList !== "function" || list.loading) {
        return;
      }

      currentQuery.current = query;
      putURLQuery(query);
      setList({
        ...list,
        loading: true,
      });
      try {
        let newList = await apiLoadList(query);

        if (typeof didLoadList === "function") {
          newList = didLoadList(list, newList);
        }
        setList({
          ...list,
          ...newList,
          loading: false,
        });
      } catch (error) {
        setList({
          ...list,
          loading: false,
        });
      }
    },
    [list, apiLoadList, didLoadList, putURLQuery]
  );

  const handleChangePage = useCallback(
    (page) =>
      loadList({
        ...currentQuery.current,
        page,
      }),
    [loadList]
  );

  return [
    {
      ...list,
      pagination: {
        ...list.pagination,
        onChange: handleChangePage,
      },
    },
    setList,
    loadList,
  ];
};

export default useList;
