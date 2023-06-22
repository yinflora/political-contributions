import { csv } from 'csvtojson';
import { useEffect, useState } from 'react';
import ReactLoading from 'react-loading';
import styled from 'styled-components/macro';
import arrow from './arrow.png';
import Compare from './components/Compare';
import Legislators from './components/Legislators';

const COMPANY_CONTRIBUTION_URL =
  'https://raw.githubusercontent.com/mirror-media/politicalcontribution/master/legislators/2016/A02_company_all_public.csv';
const LEGISLATORS_URL =
  'https://raw.githubusercontent.com/mirror-media/politicalcontribution/master/legislators/2016/A05_basic_all.csv';
export const LEGISLATORS_COMPARE_LIMIT = 2;

const Container = styled.div`
  width: 100vw;
  padding: 3% 15%;
  cursor: default;
`;

const MainTitle = styled.h1`
  margin-bottom: 3%;
  font-size: 2.5rem;
  font-weight: 600;
  text-align: center;
`;

const Description = styled.p`
  font-size: 1.25rem;
  margin: 1rem 0 1.5rem;
  text-align: center;
`;

const CompareContainer = styled.div`
  display: flex;
  width: 100%;
  margin-bottom: 1.5rem;
  justify-content: space-between;
  align-items: center;
`;

const Select = styled.select`
  width: 48%;
  padding: 1% 2%;
  outline: none;
  font-size: 1.25rem;
  cursor: pointer;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background-image: url(${arrow});
  background-position: calc(100% - 3%) center;
  background-repeat: no-repeat;
  background-size: 1rem auto;
`;

const LoadingWrapper = styled.div`
  display: flex;
  width: 100%;
  padding-top: 10%;
  justify-content: center;
  align-items: center;
`;

const Contribution = () => {
  const [legislators, setLegislators] = useState([]);
  const [comparationOptions, setComparationOptions] = useState([]);
  const [companyContribution, setCompanyContribution] = useState([]);
  const [comparisonList, setComparisonList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const convertfetchedData = async () => {
      try {
        const [legislatorsData, contributionData] = await Promise.all([
          fetch(LEGISLATORS_URL),
          fetch(COMPANY_CONTRIBUTION_URL),
        ]);

        const [convertedLegislatorsData, convertedContributionData] =
          await Promise.all([legislatorsData.text(), contributionData.text()]);

        const formattedLegislatorsData = await csv().fromString(
          convertedLegislatorsData
        );
        const formattedContributionData = await csv().fromString(
          convertedContributionData
        );

        setLegislators(formattedLegislatorsData);
        setCompanyContribution(formattedContributionData);
        setComparationOptions([
          formattedLegislatorsData,
          formattedLegislatorsData,
        ]);
        setIsLoading(false);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    convertfetchedData();
  }, []);

  const compareCandidates = (candidateInfo) => {
    const selectedCandidateIndex = comparisonList.findIndex(
      (element) => element.姓名 === candidateInfo.姓名
    );
    const newComparisonList = [...comparisonList];

    if (selectedCandidateIndex !== -1) {
      newComparisonList.splice(selectedCandidateIndex, 1);
    } else {
      comparisonList.length < LEGISLATORS_COMPARE_LIMIT &&
        newComparisonList.push(candidateInfo);
    }

    setComparisonList(newComparisonList);
  };

  const compareSelectedCandidates = (candidateInfo, selectIndex) => {
    const newComparisonList = [...comparisonList];

    if (comparisonList.length < LEGISLATORS_COMPARE_LIMIT) {
      newComparisonList.push(candidateInfo);
    } else {
      newComparisonList[selectIndex] = candidateInfo;
    }

    setComparisonList(newComparisonList);
  };

  const sortedContributions = comparisonList.map((candidate) => {
    const filteredDetails = companyContribution.filter(
      (detail) => detail.候選人 === candidate.姓名
    );
    const sortedDetails = filteredDetails.sort(
      (a, b) => parseInt(b.收入金額) - parseInt(a.收入金額)
    );

    return sortedDetails;
  });

  return (
    <Container>
      <MainTitle>2016 年政治獻金比較</MainTitle>
      <Description>
        {comparisonList.length === LEGISLATORS_COMPARE_LIMIT
          ? '點擊比較項目可確認詳細內容'
          : '請選擇兩位政治人物進行比較，再點擊一次即可取消比較'}
      </Description>
      <CompareContainer>
        {comparationOptions.map((item, index) => (
          <Select
            onChange={(e) => {
              if (e.target.value === '請選擇想比較的姓名') return;
              const selectedData = legislators.find(
                (element) => element.姓名 === e.target.value
              );
              compareSelectedCandidates(selectedData, index);
            }}
          >
            <option selected={!comparisonList[index]}>
              請選擇想比較的姓名
            </option>
            {item.map((option) => (
              <option
                selected={
                  comparisonList[index] &&
                  comparisonList[index].姓名 === option.姓名
                }
              >
                {option.姓名}
              </option>
            ))}
          </Select>
        ))}
      </CompareContainer>
      {comparisonList.length === LEGISLATORS_COMPARE_LIMIT && (
        <Compare
          comparisonList={comparisonList}
          compareCandidates={compareCandidates}
          sortedContributions={sortedContributions}
        />
      )}
      {isLoading ? (
        <LoadingWrapper>
          <ReactLoading
            type="spokes"
            width={100}
            height={100}
            color="#5a5a5a"
          />
        </LoadingWrapper>
      ) : (
        <Legislators
          legislators={legislators}
          comparisonList={comparisonList}
          compareCandidates={compareCandidates}
        />
      )}
    </Container>
  );
};

export default Contribution;
