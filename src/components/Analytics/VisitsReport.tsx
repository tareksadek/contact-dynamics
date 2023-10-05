import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { format } from 'date-fns'
import { Button, Box, Typography, CircularProgress } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { getVisitsForLast30Days } from '../../API/profile';
import { RootState } from '../../store/reducers';
import { VisitType } from '../../types/profile';

const TimePeriods = {
  THIS_WEEK: 'This Week',
  THIS_MONTH: 'This Month',
};

const VisitsReport = () => {
  const user = useSelector((state: RootState) => state.user.user);
  const profile = useSelector((state: RootState) => state.profile.profile);

  const [selectedPeriod, setSelectedPeriod] = useState(TimePeriods.THIS_WEEK);
  const [visitsData, setVisitsData] = useState<{ visitedOn: string; count: number; userId: string; profileId: string }[]>([]);
  const [loading, setLoading] = useState(true);

  console.log(visitsData);

  const groupVisitsByDate = (visits: VisitType[]) => {
    const groupedData: { [key: string]: number } = {};

    visits.forEach(visit => {
      // Ensure visitedOn is a string
      const visitedOnKey = typeof visit.visitedOn === 'string' 
        ? visit.visitedOn 
        : format(visit.visitedOn, 'dd/MM/yyyy');

      if (groupedData[visitedOnKey]) {
        groupedData[visitedOnKey]++;
      } else {
        groupedData[visitedOnKey] = 1;
      }
    });

    return Object.entries(groupedData).map(([visitedOn, count]) => ({ visitedOn, count }));
  };

  useEffect(() => {
    const fetchVisits = async () => {
      setLoading(true); 
  
      if (user && user.id && profile && profile.id) {
        const rawData = await getVisitsForLast30Days(user.id, profile.id);
        const data: VisitType[] = rawData.map((doc: any) => ({
          userId: doc.userId,
          profileId: doc.profileId,
          visitedOn: format(doc.visitedOn.toDate(), 'dd/MM/yyyy')
        }));
  
        const transformedData = groupVisitsByDate(data);
        const enrichedTransformedData = transformedData.map(item => ({
          ...item,
          userId: user.id,
          profileId: profile.id || ''
        }));
  
        if (selectedPeriod === TimePeriods.THIS_WEEK) {
          // Note: Depending on your definition of "This Week", you can adjust this logic.
          const last7days = Array.from({ length: 7 }, (_, i) => format(new Date(Date.now() - i * 24 * 60 * 60 * 1000), 'dd/MM/yyyy'));
          const weekData = data.filter((visit) => last7days.includes(visit.visitedOn.toString()));
          const weekDataAggregated = groupVisitsByDate(weekData);
          setVisitsData(weekDataAggregated.map(item => ({
            ...item,
            userId: user.id,
            profileId: profile.id || ''
          })));
        } else if (selectedPeriod === TimePeriods.THIS_MONTH) {
          setVisitsData(enrichedTransformedData);
        }
      }
  
      setLoading(false);
    };
  
    fetchVisits();
  }, [selectedPeriod, user, profile]);
  
  

  return (
    <Box p={3} border={1} borderColor="divider" borderRadius={2}>
      <Typography variant="h6">Visits Report</Typography>
      {profile&& (
        <Box mt={2}>
          <Typography>Total Visits: {profile.visits || 0}</Typography>
        </Box>
      )}
      {loading ? (
        <Box display="flex" flexDirection="column" alignItems="center" mt={4}>
          <CircularProgress />
          <Typography mt={2}>Creating visits chart...</Typography>
        </Box>
      ) : (
        <>
          <Box mt={2}>
            <Button onClick={() => setSelectedPeriod(TimePeriods.THIS_WEEK)}>{TimePeriods.THIS_WEEK}</Button>
            <Button onClick={() => setSelectedPeriod(TimePeriods.THIS_MONTH)}>{TimePeriods.THIS_MONTH}</Button>
          </Box>
          <Box mt={2} width={500} height={300}>
            <LineChart width={500} height={300} data={visitsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="visitedOn" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#8884d8" activeDot={{ r: 8 }} />
            </LineChart>
          </Box>
        </>
      )}
    </Box>
  );
};

export default VisitsReport;