import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from 'chart.js';
import { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import styled from 'styled-components/macro';
import { partyColors } from '../../utils/partyColors';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const COMPARE_ITEMS = [
  {
    title: '總收入',
    unit: '元',
  },
  {
    title: '捐贈企業數',
    unit: '家',
  },
];
const COMPANY_COMPARE_LIMIT = 20;

const Container = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 1.5rem;
`;

const CompareContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
`;

const CompareBox = styled.div`
  position: relative;
  width: 48%;
  height: 100%;
  padding: 3%;

  &:nth-of-type(1) {
    background-color: #efc57f;
  }

  &:nth-of-type(2) {
    background-color: #587791;
  }
`;

const CancelBtn = styled.button`
  position: absolute;
  top: 0;
  right: 0;
  width: 25px;
  height: 25px;
  line-height: 25px;
  text-align: center;
  background-color: #5a5a5a;
  color: #fff;
  cursor: pointer;
`;

const CompareInfo = styled.div`
  display: flex;
  margin-bottom: 6%;
  align-items: center;
  gap: 3%;
`;

const CompareTitle = styled.span`
  font-size: 1.75rem;
  font-weight: 600;
  color: #fff;
`;

const CompareText = styled.div`
  padding: 0 3%;
  line-height: 1.75rem;
  color: #fff;
  background-color: ${({ $bgColor }) => $bgColor};
`;

const CompareItemWrapper = styled.div`
  display: flex;
  gap: 5%;
`;

const CompareItem = styled.div`
  display: flex;
  flex: 1;
  padding: 5%;
  flex-direction: column;
  background-color: ${({ $isSelected }) =>
    $isSelected ? '#fff' : 'rgb(255,255,255, 0.7)'};
  cursor: pointer;
`;

const ItemTite = styled.p`
  color: #a0a0a0;
`;

const ItemText = styled.p`
  margin-top: 5%;
  font-size: 1.5rem;
  font-weight: 500;
`;

const ContributionWrapper = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
`;

const DetailContainer = styled.div`
  width: 100%;
  padding: 3% 6%;
  border: 1px solid #a0a0a0;
`;

const RankingWrapper = styled.ul`
  width: 48%;
`;

const DetailTitle = styled.p`
  margin-bottom: 3%;
  font-size: 2rem;
  font-weight: 600;
  text-align: center;
`;

const RankingItem = styled.li`
  display: flex;
  line-height: 2rem;

  &:nth-of-type(odd) {
    position: relative;

    &::before {
      content: '';
      z-index: -1;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: ${({ $bgColor }) => $bgColor};
      opacity: 0.3;
    }
  }
`;

const RankingList = styled.p`
  padding: 0 10px;
  color: gray;
`;

const CompanyName = styled.p``;

const ContributionAmount = styled.p`
  margin-left: auto;
  padding: 0 10px;
`;

const Compare = ({
  comparisonList,
  compareCandidates,
  sortedContributions,
}) => {
  const [comparisonMode, setComparisonMode] = useState(COMPARE_ITEMS[0].title);

  const labels = ['個人', '營利事業', '政黨', '人民團體', '匿名', '其他'];
  const colors = ['#efc57f', '#587791'];
  const chartData = {
    labels,
    datasets: [],
  };

  comparisonList.forEach((element, index) => {
    const newData = {
      label: element.姓名,
      data: [
        parseInt(element.個人捐贈收入.replace(/,/g, '')),
        parseInt(element.營利事業捐贈收入.replace(/,/g, '')),
        parseInt(element.政黨捐贈收入.replace(/,/g, '')),
        parseInt(element.人民團體捐贈收入.replace(/,/g, '')),
        parseInt(element.匿名捐贈收入.replace(/,/g, '')),
        parseInt(element.其他收入.replace(/,/g, '')),
      ],
      backgroundColor: colors[index],
    };
    chartData.datasets.push(newData);
  });

  return (
    <Container>
      <CompareContainer>
        {comparisonList.map((list, index) => (
          <CompareBox key={list.姓名}>
            <CancelBtn onClick={() => compareCandidates(list)}>X</CancelBtn>
            <CompareInfo>
              <CompareTitle>{list.姓名}</CompareTitle>
              <CompareText $bgColor={partyColors[list.推薦政黨]}>
                {list.推薦政黨}
              </CompareText>
            </CompareInfo>
            <CompareItemWrapper>
              {COMPARE_ITEMS.map((item) => (
                <CompareItem
                  onClick={() => setComparisonMode(item.title)}
                  $isSelected={comparisonMode === item.title}
                >
                  <ItemTite>{item.title}</ItemTite>
                  <ItemText>
                    {`${(() => {
                      switch (item.title) {
                        case '總收入':
                          return Number(list.總收入).toLocaleString('zh-TW');
                        case '捐贈企業數':
                          return sortedContributions[index].length;
                        default:
                          return '';
                      }
                    })()} ${item.unit}`}
                  </ItemText>
                </CompareItem>
              ))}
            </CompareItemWrapper>
          </CompareBox>
        ))}
      </CompareContainer>
      {comparisonMode === '總收入' && (
        <DetailContainer>
          <DetailTitle>捐贈來源</DetailTitle>
          <Bar data={chartData} />
        </DetailContainer>
      )}
      {comparisonMode === '捐贈企業數' && (
        <DetailContainer>
          <DetailTitle>捐贈企業 Top{COMPANY_COMPARE_LIMIT}</DetailTitle>
          <ContributionWrapper>
            {sortedContributions.map((item, itemIndex) => (
              <RankingWrapper>
                {item.slice(0, COMPANY_COMPARE_LIMIT).map((detail, index) => (
                  <RankingItem $bgColor={colors[itemIndex]}>
                    <RankingList>{index + 1}</RankingList>
                    <CompanyName>{detail['捐贈者／支出對象']}</CompanyName>
                    <ContributionAmount>
                      {Number(detail.收入金額).toLocaleString('zh-TW')} 元
                    </ContributionAmount>
                  </RankingItem>
                ))}
              </RankingWrapper>
            ))}
          </ContributionWrapper>
        </DetailContainer>
      )}
    </Container>
  );
};

export default Compare;
