import styled from 'styled-components';
import { LEGISLATORS_COMPARE_LIMIT } from '../../Contribution';
import { partyColors } from '../../utils/partyColors';

const TITLES = ['比較', '姓名', '推薦政黨', '總收入'];

const Container = styled.div`
  display: flex;
  margin-top: 1.5rem;
  flex-direction: column;
`;

const TableHeader = styled.div`
  display: flex;
  background-color: #5a5a5a;
`;

const TableCell = styled.li`
  display: flex;
  min-width: fit-content;
  width: 20%;
  height: 2.5rem;
  margin-left: 3%;
  align-items: center;

  &:nth-of-type(1) {
    width: 5%;
  }

  &:nth-of-type(2) {
    width: 15%;
  }
`;

const Title = styled(TableCell)`
  font-size: 1.25rem;
  font-weight: 500;
  color: #fff;
`;

const TableRow = styled.ul`
  display: flex;
  border: ${({ $isSelected }) => $isSelected && '1px solid #5a5a5a'};
  cursor: ${({ $isClickable }) => ($isClickable ? 'pointer' : 'default')};

  &:nth-of-type(odd) {
    background-color: #f9f9f9;
  }
`;

const Text = styled(TableCell)`
  line-height: 2rem;

  &:nth-of-type(1) {
    justify-content: center;
  }
`;

const PartyColor = styled.div`
  width: 1.25rem;
  height: 1.25rem;
  margin-right: 10px;
  border: 0.5px solid #5a5a5a;
  background-color: ${({ $color }) => $color};
`;

const Legislators = ({ legislators, comparisonList, compareCandidates }) => {
  const isSelected = (data) => {
    const selectedIndex = comparisonList.findIndex(
      (element) => element.姓名 === data.姓名
    );
    return selectedIndex === -1 ? false : true;
  };

  return (
    <Container>
      <TableHeader>
        {TITLES.map((title) => (
          <Title key={title}>{title}</Title>
        ))}
      </TableHeader>
      {legislators.map((data) => (
        <TableRow
          key={data.姓名}
          onClick={() => compareCandidates(data)}
          $isSelected={isSelected(data)}
          $isClickable={
            isSelected(data) ||
            comparisonList.length < LEGISLATORS_COMPARE_LIMIT
          }
        >
          <Text>{isSelected(data) ? 'V' : ''}</Text>
          <Text>{data.姓名}</Text>
          <Text>
            <PartyColor $color={partyColors[data.推薦政黨]} />
            <p>{data.推薦政黨}</p>
          </Text>
          <Text>{Number(data.總收入).toLocaleString('zh-TW')} 元</Text>
        </TableRow>
      ))}
    </Container>
  );
};

export default Legislators;
