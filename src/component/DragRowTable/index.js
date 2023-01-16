import { useTable } from "react-table";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import update from "immutability-helper";
import "./style.css";
import React from "react";

const Table = ({ columns, data }) => {
  const [records, setRecords] = React.useState(data);
  console.log("records", records);

  const getRowId = React.useCallback((row) => {
    return row.id;
  }, []);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({
      data: records,
      columns,
    });

  const moveRow = (dragIndex, hoverIndex) => {
    const dragRecord = records[dragIndex];
    setRecords(
      update(records, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, dragRecord],
        ],
      })
    );
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => {
            return (
              <tr {...headerGroup.getHeaderGroupProps()}>
                <th></th>
                {headerGroup.headers.map((column) => {
                  return (
                    <th {...column.getHeaderProps()}>
                      {column.render("Header")}
                    </th>
                  );
                })}
              </tr>
            );
          })}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row, index) => {
            return (
              prepareRow(row) || (
                <Row
                  index={index}
                  row={row}
                  originalData={data}
                  data={records}
                  moveRow={moveRow}
                  {...row.getRowProps()}
                />
              )
            );
          })}
        </tbody>
      </table>
    </DndProvider>
  );
};

const DND_ITEM_TYPE = "row";

const Row = ({ row, index, moveRow, data, originalData }) => {
  const dropRef = React.useRef(null);
  const dragRef = React.useRef(null);

  const restructureData = (from, to) => {
    const result = data.map((item, index) => {
      return {
        _id: item._id,
        rowIndex: index,
      };
    });

    return result;
  };

  const [, drop] = useDrop({
    accept: DND_ITEM_TYPE,
    hover(item, monitor) {
      if (!dropRef.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;
      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }
      // Determine rectangle on screen
      const hoverBoundingRect = dropRef.current.getBoundingClientRect();
      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      // Determine mouse position
      const clientOffset = monitor.getClientOffset();
      // Get pixels to the top
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;
      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%
      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }
      // Time to actually perform the action
      moveRow(dragIndex, hoverIndex);
      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    },
    drop: (item, monitor) => {
      console.log("item", item, index);
      const newData = restructureData(index, item.index);
      window
        .fetch("https://google.com", {
          method: "POST",
          body: JSON.stringify(newData),
        })
        .then(
          (data) => console.log("data"),
          (error) => console.log(error)
        );
    },
  });

  const [{ isDragging }, drag, preview] = useDrag({
    item: { index },
    type: DND_ITEM_TYPE,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const opacity = isDragging ? 0 : 1;

  preview(drop(dropRef));
  drag(dragRef);

  return (
    <tr ref={dropRef} style={{ opacity }}>
      <td ref={dragRef}>move</td>
      {row.cells.map((cell) => {
        return <td {...cell.getCellProps()}>{cell.render("Cell")}</td>;
      })}
    </tr>
  );
};

const DragRowTable = () => {
  const columns = React.useMemo(
    () => [
      {
        Header: "First Name",
        accessor: "firstName",
      },
      {
        Header: "Last Name",
        accessor: "lastName",
      },
      {
        Header: "Email",
        accessor: "email",
      },
      {
        Header: "Phone Number",
        accessor: "salesPhoneNumber",
      },
      {
        Header: "Company Name",
        accessor: "companyName",
      },
      {
        Header: "Credits",
        accessor: "credits",
      },
    ],
    []
  );

  const data = React.useMemo(
    () => [
      {
        _id: "63bfa736bf454c1c501b903b",
        firstName: "aaaa",
        lastName: "aaaa",
        email: "aaaa@gmail.com",
        salesPhoneNumber: "+1 (436) 464-56",
        role: "user",
        address: "QQQQ",
        city: "QQQQ",
        country: "QQQQ",
        postCode: "123456",
        companyName: "QQQQQ",
        companyUSPs: "QWWWWWW",
        autoCharge: true,
        leadCost: 10,
        isRyftCustomer: true,
        isLeadbyteCustomer: true,
        credits: 500,
        verifiedAt: null,
        isVerified: true,
        isActive: true,
        activatedAt: null,
        isDeleted: false,
        deletedAt: null,
        createdAt: "2023-01-12T06:22:46.599Z",
        updatedAt: "2023-01-13T06:33:19.837Z",
        __v: 0,
        buyerId: "184",
        rowIndex: 7,
      },
      {
        _id: "63ad8a0e49663668dc1e446a",
        firstName: "jack",
        lastName: "doee",
        email: "jack@example.com",
        salesPhoneNumber: "9988543215",
        role: "user",
        address: "1234 garden valley",
        city: "victoria",
        country: "australia",
        postCode: "123456",
        companyName: "secret",
        companyUSPs: "qwertyuiisaewdnnscdbfbcbdfb",
        autoCharge: true,
        leadCost: 10,
        isRyftCustomer: true,
        isLeadbyteCustomer: true,
        verifiedAt: null,
        isVerified: true,
        isActive: true,
        activatedAt: null,
        isDeleted: false,
        deletedAt: null,
        createdAt: "2022-12-29T12:37:34.638Z",
        updatedAt: "2023-01-12T12:20:31.605Z",
        __v: 0,
        buyerId: "123",
        credits: null,
        rowIndex: 1,
      },
      {
        _id: "63ad8b12728fa962d02c515c",
        firstName: "jerry",
        lastName: "doee",
        email: "jerry@example.com",
        salesPhoneNumber: "9999999999",
        role: "user",
        address: "1234 garden valley",
        city: "victoria",
        country: "australia",
        postCode: "123456",
        companyName: "secret",
        companyUSPs: "qweqwrwrefwerfewsffedffeswesdfewfewdf",
        autoCharge: true,
        leadCost: "10",
        isRyftCustomer: true,
        isLeadbyteCustomer: true,
        verifiedAt: null,
        isVerified: true,
        isActive: true,
        activatedAt: null,
        isDeleted: false,
        deletedAt: null,
        createdAt: "2022-12-29T12:41:54.157Z",
        updatedAt: "2022-12-29T12:43:13.780Z",
        __v: 0,
        buyerId: "124",
        credits: 500,
        rowIndex: 2,
      },
      {
        _id: "63ae817a0994bdd4f90e8bbd",
        firstName: "alina",
        lastName: "alina",
        email: "radssharma18@gmail.com",
        salesPhoneNumber: "9999999999",
        role: "user",
        address: "mohali",
        city: "mohali",
        country: "india",
        postCode: "140055",
        companyName: "alina",
        companyUSPs: "alina",
        autoCharge: true,
        leadCost: "10",
        isRyftCustomer: true,
        isLeadbyteCustomer: true,
        verifiedAt: null,
        isVerified: true,
        isActive: true,
        activatedAt: null,
        isDeleted: false,
        deletedAt: null,
        createdAt: "2022-12-30T06:13:14.748Z",
        updatedAt: "2023-01-12T05:19:22.650Z",
        __v: 0,
        buyerId: "127",
        credits: 500,
        rowIndex: 3,
      },
      {
        _id: "63aed277bf2d3eda4e0edcc0",
        firstName: "anny111224",
        lastName: "ann1",
        email: "anny@gmail.com",
        salesPhoneNumber: "+1242346346464",
        role: "user",
        address: "mohali1",
        city: "234234234mohali1",
        country: "india1",
        postCode: "140058",
        companyName: "anny12",
        companyUSPs: "anny1",
        autoCharge: null,
        leadCost: "10",
        isRyftCustomer: true,
        isLeadbyteCustomer: true,
        verifiedAt: null,
        isVerified: true,
        isActive: true,
        activatedAt: null,
        isDeleted: false,
        deletedAt: null,
        createdAt: "2022-12-30T11:58:47.366Z",
        updatedAt: "2023-01-13T09:30:29.949Z",
        __v: 0,
        buyerId: "128",
        credits: -90,
        delivery: "active",
        rowIndex: 4,
      },
      {
        _id: "63aed4a0b03112ca2f66c281",
        firstName: "anny",
        lastName: "anny",
        email: "annyyyyy@gmail.com",
        salesPhoneNumber: "9999999999",
        role: "user",
        address: "mohali",
        city: "mohali",
        country: "india",
        postCode: "140055",
        companyName: "anny",
        companyUSPs: "anny",
        autoCharge: true,
        leadCost: "10",
        isRyftCustomer: false,
        isLeadbyteCustomer: false,
        verifiedAt: null,
        isVerified: true,
        isActive: true,
        activatedAt: null,
        isDeleted: false,
        deletedAt: null,
        createdAt: "2022-12-30T12:08:00.685Z",
        updatedAt: "2023-01-03T06:19:28.778Z",
        __v: 0,
        credits: 0,
        rowIndex: 5,
      },
      {
        _id: "63bba6c5cfc65f0547458bae",
        firstName: "january",
        lastName: "january",
        email: "january@example.com",
        salesPhoneNumber: "7896541230",
        role: "user",
        address: "hs no. 455/12, ashoka garden",
        city: "victoria",
        country: "australlia",
        postCode: "140055",
        companyName: "jan company",
        companyUSPs: "usps usps usps",
        autoCharge: false,
        leadCost: 100,
        isRyftCustomer: true,
        isLeadbyteCustomer: true,
        verifiedAt: null,
        isVerified: true,
        isActive: true,
        activatedAt: null,
        isDeleted: false,
        deletedAt: null,
        createdAt: "2023-01-09T05:31:49.189Z",
        updatedAt: "2023-01-13T06:21:42.894Z",
        __v: 0,
        buyerId: "151",
        credits: 180,
        rowIndex: 6,
      },
    ],
    []
  );
  return <Table columns={columns} data={data} />;
};

export { DragRowTable };
