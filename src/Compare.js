import { csv } from 'csvtojson';
import { useEffect, useState } from 'react';
import styled from 'styled-components/macro';

const Container = styled.div`
  width: 100vw;
`;

const BoxContainer = styled.div`
  padding: 0 10%;
`;

const RowBox = styled.div`
  display: flex;
`;

const BoxTitleWrapper = styled(RowBox)`
  background-color: #000;
`;

const RowText = styled.p`
  min-width: fit-content;
  width: 20%;
  margin: 0 3%;

  &:nth-of-type(1) {
    width: 5%;
  }
`;

const BoxTitle = styled(RowText)`
  font-size: 1.25rem;
  line-height: 2.5rem;
  color: #fff;
`;

const BoxContent = styled(RowBox)`
  background-color: ${({ $isSelected }) => $isSelected && '#959595'};
  border: 1px solid #959595;
  border-top: none;
`;

const BoxText = styled(RowText)`
  line-height: 2rem;

  &:nth-of-type(1) {
    text-align: center;
  }
`;

const tableData = ['比較', '姓名', '推薦政黨', '總收入'];

const Compare = () => {
  const [contributionData, setContributionData] = useState([]);
  const [comparisonList, setComparisonList] = useState([]);

  useEffect(() => {
    const convertCSVtoJSON = async () => {
      try {
        const csvUrl =
          'https://raw.githubusercontent.com/mirror-media/politicalcontribution/master/legislators/2016/A05_basic_all.csv';

        const response = await fetch(csvUrl);
        const csvData = await response.text();

        const data = await csv().fromString(csvData);
        setContributionData(data);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    convertCSVtoJSON();
  }, []);

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

  return (
    <Container>
      {comparisonList.length > 0 && (
        <div>
          {comparisonList.map((list) => (
            <div>{list.姓名}</div>
          ))}
        </div>
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
              <BoxText>{data.推薦政黨}</BoxText>
              <BoxText>{Number(data.總收入).toLocaleString('zh-TW')}</BoxText>
            </BoxContent>
          ))}
      </BoxContainer>
    </Container>
  );
};

export default Compare;
