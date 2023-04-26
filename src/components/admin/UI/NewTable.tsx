import React, { useState, useEffect } from 'react';
import Paper from '@mui/material/Paper';
import {
  SelectionState,
  TreeDataState,
  CustomTreeData,
} from '@devexpress/dx-react-grid';
import {
  Grid,
  Table,
  TableHeaderRow,
  TableTreeColumn,
} from '@devexpress/dx-react-grid-material-ui';

const getChildRows = (row, rootRows) => (row ? row.children : rootRows);

function buildItemsTree(items: {id: number, parent: { id: number }}[]): any[] {
  const itemMap = new Map();
  items.forEach((item) => {
    itemMap.set(item.id, {...item, children: []})
  })
  const rootItems: any[] = [];
  items.forEach((item) => {
    if (item.parent) {
      const parent = itemMap.get(item.parent['id']);
      parent.children.push(itemMap.get(item.id));
    } else {
      rootItems.push(itemMap.get(item.id));
    }

  });
  return rootItems;
}

export default function TableUI({ data, columns }) {
  const [tableColumnExtensions] = useState([
    { columnName: 'name', width: 300 },
  ]);
  const [treeData, setTreeData] = useState<any[]>([])
  const [defaultExpandedRowIds] = useState([0]);

  useEffect(() => {
    setTreeData(buildItemsTree(data));
  }, [data])

  if (!treeData) {
    return <p>Loading...</p>
  }
  return (
    <Paper>
      <Grid rows={treeData} columns={columns}>
        <SelectionState />
        <TreeDataState defaultExpandedRowIds={defaultExpandedRowIds} />
        <CustomTreeData getChildRows={getChildRows} />
        <Table columnExtensions={tableColumnExtensions} />
        <TableHeaderRow />
        <TableTreeColumn for="name" showSelectionControls />
      </Grid>
    </Paper>
  );
}
