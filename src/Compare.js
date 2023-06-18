import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from 'chart.js';
import { csv } from 'csvtojson';
import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import styled from 'styled-components/macro';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Container = styled.div`
  width: 100vw;
  padding: 0 15%;
  cursor: default;
`;

const BoxContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const RowBox = styled.div`
  display: flex;
`;

const BoxTitleWrapper = styled(RowBox)`
  background-color: #5a5a5a;
  /* border-bottom: 1px solid #5a5a5a; */
`;

const RowText = styled.p`
  display: flex;
  min-width: fit-content;
  width: 15%;
  height: 2.5rem;
  /* margin: 0 3%; */
  margin-left: 3%;
  align-items: center;

  &:nth-of-type(1) {
    width: 5%;
  }
`;

const BoxTitle = styled(RowText)`
  font-size: 1.25rem;
  font-weight: 500;
  color: #fff;
`;

const BoxContent = styled(RowBox)`
  border: ${({ $isSelected }) => $isSelected && '1px solid #5a5a5a'};

  &:nth-of-type(odd) {
    background-color: #f9f9f9;
  }
`;

const BoxText = styled(RowText)`
  line-height: 2rem;

  &:nth-of-type(1) {
    justify-content: center;
  }
`;

//比較

const CompareContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
`;

const CompareBox = styled.div`
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

const CompareInfo = styled.div`
  display: flex;
  margin-bottom: 6%;
  align-items: center;
  gap: 3%;
`;

const CompareTitle = styled.span`
  font-size: 1.75rem;
  font-weight: 600;
  /* line-height: 3rem; */
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
`;

const ItemTite = styled.p`
  color: #a0a0a0;
`;

const ItemText = styled.p`
  margin-top: 5%;
  font-size: 1.5rem;
  font-weight: 500;
`;

const DonationBox = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
`;

const CompareBoxContainer = styled.div`
  width: 100%;
  padding: 3% 6%;
  border: 1px solid #a0a0a0;
`;

const RankingWrapper = styled.ul`
  width: 48%;
`;

const RankingTitle = styled.p`
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

const CandidateName = styled.p`
  margin-bottom: 3%;
  font-size: 1.5rem;
`;

const RankingList = styled.p`
  padding: 0 10px;
  color: gray;
`;

const CompanyName = styled.p``;

const DonationPrice = styled.p`
  margin-left: auto;
  padding: 0 10px;
`;

const tableData = ['比較', '姓名', '推薦政黨', '總收入'];

const labels = ['個人', '營利事業', '政黨', '人民團體', '匿名', '其他'];

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
  },
};

const partyColor = {
  民主進步黨: '#1B9431',
  中國國民黨: '#000095',
  台灣民眾黨: '#28C8C8',
  時代力量: '#F9BE01',
  親民黨: '#FF6310',
  台灣基進: '#A73f24',
  無黨團結聯盟: '#C20F51',
  台灣團結聯盟: '#AB6300',
  新黨: '#FFDB00',
  台灣綠黨: '#99E64D',
  社會民主黨: '#FF0088',
  中華統一促進黨: '#000080',
  勞動黨: '#FF0000',
  人民民主黨: '#FB0100',
  民國黨: '#FFEA00',
  信心希望聯盟: '#006F7F',
  樹黨: '#B4D205',
  健保免費連線: '#8B00FF',
  自由台灣黨: '#E04155',
  軍公教聯盟黨: '#3F48CC',
  大愛憲改聯盟: '#FF0000',
  台灣工黨: '#008000',
  歡樂無法黨: '#FF0000',
  國會政黨聯盟: '#FFEA00',
  台灣維新: '#51458B',
  喜樂島聯盟: '#009e96',
  台澎國際法法理建國黨: '#77AEA5',
  一邊一國行動黨: '#5BBEDE',
  安定力量: '#633f99',
  宗教聯盟: '#EAD9A5',
  綠黨社會民主黨聯盟: '#F00078',
  天一黨: '#AA5345',
  無黨籍: '#999999',
  其他政黨: '#d4d4d4',
};

const Compare = () => {
  const [contributionDetails, setContributionDetails] = useState([]);
  const [contributionData, setContributionData] = useState([]);
  const [comparisonList, setComparisonList] = useState([]);
  const [comparisonDetails, setComparisonDetails] = useState([]);
  const [comparisonMode, setComparisonMode] = useState('總收入');

  useEffect(() => {
    const convertCSVtoJSON = async () => {
      try {
        const csvDetailUrl =
          'https://raw.githubusercontent.com/mirror-media/politicalcontribution/master/legislators/2016/A02_company_all_public.csv';
        const csvUrl =
          'https://raw.githubusercontent.com/mirror-media/politicalcontribution/master/legislators/2016/A05_basic_all.csv';

        const detailResponse = await fetch(csvDetailUrl);
        const detailCsvData = await detailResponse.text();

        const response = await fetch(csvUrl);
        const csvData = await response.text();

        const detailData = await csv().fromString(detailCsvData);
        const data = await csv().fromString(csvData);

        setContributionDetails(detailData);
        setContributionData(data);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    convertCSVtoJSON();
  }, []);

  useEffect(() => {
    const sortQtyDetails = () => {
      const selectedDetails = comparisonList.map((candidate) => {
        const filteredDetails = contributionDetails.filter(
          (detail) => detail.候選人 === candidate.姓名
        );
        const sortedDetails = filteredDetails.sort(
          (a, b) => parseInt(b.收入金額) - parseInt(a.收入金額)
        );

        return sortedDetails;
      });
      setComparisonDetails(selectedDetails);
    };
    sortQtyDetails();
  }, [contributionDetails, comparisonList]);

  const compareCandidates = (candidate) => {
    const selectedCandidateIndex = comparisonList.findIndex(
      (element) => element.姓名 === candidate.姓名
    );
    const newComparisonList = [...comparisonList];

    if (selectedCandidateIndex !== -1) {
      newComparisonList.splice(selectedCandidateIndex, 1);
    } else {
      newComparisonList.length < 2 && newComparisonList.push(candidate);
    }

    setComparisonList(newComparisonList);
  };

  const chartData = {
    labels,
    datasets: [
      {
        label: comparisonList.length === 2 ? comparisonList[0].姓名 : '',
        data:
          comparisonList.length === 2
            ? [
                parseInt(comparisonList[0].個人捐贈收入.replace(/,/g, '')),
                parseInt(comparisonList[0].營利事業捐贈收入.replace(/,/g, '')),
                parseInt(comparisonList[0].政黨捐贈收入.replace(/,/g, '')),
                parseInt(comparisonList[0].人民團體捐贈收入.replace(/,/g, '')),
                parseInt(comparisonList[0].匿名捐贈收入.replace(/,/g, '')),
                parseInt(comparisonList[0].其他收入.replace(/,/g, '')),
              ]
            : [],
        backgroundColor: '#efc57f',
      },
      {
        label: comparisonList.length === 2 ? comparisonList[1].姓名 : '',
        data:
          comparisonList.length === 2
            ? [
                parseInt(comparisonList[1].個人捐贈收入.replace(/,/g, '')),
                parseInt(comparisonList[1].營利事業捐贈收入.replace(/,/g, '')),
                parseInt(comparisonList[1].政黨捐贈收入.replace(/,/g, '')),
                parseInt(comparisonList[1].人民團體捐贈收入.replace(/,/g, '')),
                parseInt(comparisonList[1].匿名捐贈收入.replace(/,/g, '')),
                parseInt(comparisonList[1].其他收入.replace(/,/g, '')),
              ]
            : [],
        backgroundColor: '#587791',
      },
    ],
  };

  return (
    <Container>
      {comparisonList.length === 2 && (
        <CompareContainer>
          {comparisonList.map((list, index) => (
            <CompareBox>
              <CompareInfo>
                <CompareTitle>{list.姓名}</CompareTitle>
                <CompareText $bgColor={partyColor[list.推薦政黨]}>
                  {list.推薦政黨}
                </CompareText>
              </CompareInfo>
              <CompareItemWrapper>
                <CompareItem
                  onClick={() => setComparisonMode('總收入')}
                  $isSelected={comparisonMode === '總收入'}
                >
                  <ItemTite>總收入</ItemTite>
                  <ItemText>
                    {Number(list.總收入).toLocaleString('zh-TW')} 元
                  </ItemText>
                </CompareItem>
                <CompareItem
                  onClick={() => setComparisonMode('捐贈企業數')}
                  $isSelected={comparisonMode === '捐贈企業數'}
                >
                  <ItemTite>捐贈企業數</ItemTite>
                  <ItemText>{comparisonDetails[index]?.length} 家</ItemText>
                </CompareItem>
              </CompareItemWrapper>
            </CompareBox>
          ))}
        </CompareContainer>
      )}
      {comparisonMode === '總收入' && comparisonList.length === 2 && (
        <CompareBoxContainer>
          <RankingTitle>捐贈來源</RankingTitle>
          <Bar options={options} data={chartData} />
        </CompareBoxContainer>
      )}
      {comparisonMode === '捐贈企業數' &&
        comparisonList.length === 2 &&
        comparisonDetails.length === 2 && (
          <CompareBoxContainer>
            <RankingTitle>捐贈企業 Top20</RankingTitle>
            <DonationBox>
              {comparisonDetails.map((item, itemIndex) => (
                <RankingWrapper>
                  <CandidateName>
                    {comparisonList[itemIndex].姓名}
                  </CandidateName>
                  {item.slice(0, 20).map((detail, index) => (
                    <RankingItem
                      $bgColor={
                        (itemIndex + 1) % 2 === 0 ? '#587791' : '#efc57f'
                      }
                    >
                      <RankingList>{index + 1}</RankingList>
                      <CompanyName>{detail['捐贈者／支出對象']}</CompanyName>
                      <DonationPrice>
                        {Number(detail.收入金額).toLocaleString('zh-TW')} 元
                      </DonationPrice>
                    </RankingItem>
                  ))}
                </RankingWrapper>
              ))}
            </DonationBox>
          </CompareBoxContainer>
        )}
      <BoxContainer>
        <BoxTitleWrapper>
          {tableData.map((item) => (
            <BoxTitle key={item}>{item}</BoxTitle>
          ))}
        </BoxTitleWrapper>
        {contributionData.length > 0 &&
          contributionData.map((data) => (
            <BoxContent
              key={data.姓名}
              onClick={() => compareCandidates(data)}
              $isSelected={
                comparisonList.findIndex(
                  (element) => element.姓名 === data.姓名
                ) !== -1
              }
            >
              {comparisonList.findIndex(
                (element) => element.姓名 === data.姓名
              ) === -1 ? (
                <BoxText />
              ) : (
                <BoxText>V</BoxText>
              )}
              <BoxText>{data.姓名}</BoxText>
              <BoxText $bgColor={partyColor[data.推薦政黨]}>
                {data.推薦政黨}
              </BoxText>
              <BoxText>
                {Number(data.總收入).toLocaleString('zh-TW')} 元
              </BoxText>
            </BoxContent>
          ))}
      </BoxContainer>
    </Container>
  );
};

export default Compare;
