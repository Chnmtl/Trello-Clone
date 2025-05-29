import { Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const sampleData = [
  { name: 'Alice', tasks: 5 },
  { name: 'Bob', tasks: 3 },
  { name: 'Charlie', tasks: 7 },
];

const Tables = () => (
  <Box p={2}>
    <Typography variant="h4" gutterBottom>Tables</Typography>
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Tasks</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sampleData.map((row, idx) => (
            <TableRow key={idx}>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.tasks}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  </Box>
);

export default Tables;
