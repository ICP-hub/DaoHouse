import React from 'react';
import { useTable } from 'react-table';
import './TableComponent.css';
import { GiSandsOfTime } from "react-icons/gi";
import { useNavigate } from 'react-router-dom';

const TableComponent = ({ data }) => {
  const columns = React.useMemo(
    () => [
      {
        Header: 'ID',
        accessor: 'id',
        Cell: ({ value }) => <span className="px-2.5 py-0.5 text-[16px] bg-[#D4C36B] rounded-full font-semibold text-white">{value}</span>
      },
      {
        Header: 'Description',
        accessor: 'description',
        Cell: ({ value }) => <span className="text-[16px]  font-normal text-black">{value}</span>
      },
      {
        Header: 'Submit/Expire',
        accessor: 'submitExpire',
        Cell: ({ value }) => <span className="text-[16px]  font-normal text-black">{value}</span>
      },
      {
        Header: 'Favour/Against',
        accessor: 'favourAgainst',
        Cell: ({ value }) => (
          <span className={value.includes('/') ? "text-green-500 text-center" : "text-red-500 text-center"}>{value}</span>
        ),
        className: 'text-center'
      },
      {
        Header: 'Status',
        accessor: 'status',
        Cell: ({ value }) => (
          <span className={`px-2 flex items-center max-w-[100px] justify-center text-[12px] py-0.5 rounded-full ${value === 'In Progress' ? 'bg-[#97C3D3] text-[#0E3746]' : value === 'Rejected' ? 'bg-[#FDC9C9] text-[#FC3232]' : value === 'Approved' ? 'bg-[#A0ECB1] text-[#388B4A]' : value === 'Expired' ? 'bg-[#DDDDDD] text-[#797979]' : ''}`}>

            {
              value === 'Expired' && <GiSandsOfTime />

            }
            {value}
          </span>
        )
      },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data });

  const navigate = useNavigate()

  const handleRowClick = (id) => {
    const cleanedId = id.replace(/#/g, '');
    navigate(`/my-proposals/${cleanedId}`);
  };
  return (
    <div className="container mx-auto p-4">
      <table {...getTableProps()} className="min-w-full bg-white rounded-lg shadow-md">
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()} className="bg-[#F4F2EC]  text-left text-[20px] text-capitalize text-[#05212C] ">
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps()} className="py-2 px-4 border-b">{column.render('Header')}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map(row => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()} key={row.key} onClick={() => handleRowClick(row.original.id)}
                className="text-gray-700 bg-[#F4F2EC] py-3 cursor-pointer">
                {row.cells.map(cell => (
                  <td {...cell.getCellProps()} className="py-2 px-4 border-b">{cell.render('Cell')}</td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default TableComponent;
