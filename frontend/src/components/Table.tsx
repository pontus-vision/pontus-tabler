import styled from "styled-components"

const Table = ({headers, rows}) => {

  return (
  <TableStyles>
    <table className="table table-striped">
      <thead>
        <tr>
            {!!headers && headers.map(key=><th scope="col">{key.label}</th>)}
        </tr>
      </thead>
      <tbody>
        {!!rows && !!headers && rows.map(entry=><tr>
            {headers.map(col=> <td>{typeof entry[col.fieldId] !== 'object' ? entry[col.fieldId] : ""}</td>)}
          </tr>)}
      </tbody>
    </table>
  </TableStyles>
  )
}

const TableStyles = styled.div`
  overflow: auto;
  & .table {
    height: 100%
  }
`

export default Table
