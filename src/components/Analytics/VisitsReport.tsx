import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { format } from 'date-fns'
import {
  Typography,
  Box,
  CircularProgress,
  Button,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
} from '@mui/material';
import { useTheme } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import { getVisitsForLast30Days } from '../../API/profile';
import { RootState } from '../../store/reducers';
import { VisitType } from '../../types/profile';
import { ProfileDataType } from '../../types/profile';
import { analyticsStyles } from './styles';

type VisitsReportProps = {
  selectedUserId?: string | null;
  selectedUserProfile?: ProfileDataType | null;
};

const TimePeriods = {
  THIS_WEEK: 'This Week',
  THIS_MONTH: 'This Month',
};

const VisitsReport: React.FC<VisitsReportProps> = ({
  selectedUserId,
  selectedUserProfile
}) => {
  const theme = useTheme()
  const classes = analyticsStyles()
  const user = useSelector((state: RootState) => state.user.user);
  const stateProfile = useSelector((state: RootState) => state.profile.profile);

  const profile = selectedUserProfile || stateProfile
  const userId = selectedUserId || user?.id

  const [selectedPeriod, setSelectedPeriod] = useState(TimePeriods.THIS_WEEK);
  const [visitsData, setVisitsData] = useState<{ visitedOn: string; count: number; userId: string; profileId: string }[]>([]);
  const [loading, setLoading] = useState(true);

  const groupVisitsByDate = (visits: VisitType[]) => {
    const groupedData: { [key: string]: number } = {};

    visits.forEach(visit => {
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

      if (userId && profile && profile.id) {
        const rawData = await getVisitsForLast30Days(userId, profile.id);
        const data: VisitType[] = rawData.map((doc: any) => ({
          userId: doc.userId,
          profileId: doc.profileId,
          visitedOn: format(doc.visitedOn.toDate(), 'dd/MM/yyyy')
        }));

        const transformedData = groupVisitsByDate(data);
        const enrichedTransformedData = transformedData.map(item => ({
          ...item,
          userId: userId,
          profileId: profile.id || ''
        }));

        if (selectedPeriod === TimePeriods.THIS_WEEK) {
          // Note: Depending on your definition of "This Week", you can adjust this logic.
          const last7days = Array.from({ length: 7 }, (_, i) => format(new Date(Date.now() - i * 24 * 60 * 60 * 1000), 'dd/MM/yyyy'));
          const weekData = data.filter((visit) => last7days.includes(visit.visitedOn.toString()));
          const weekDataAggregated = groupVisitsByDate(weekData);
          setVisitsData(weekDataAggregated.map(item => ({
            ...item,
            userId: userId,
            profileId: profile.id || ''
          })));
        } else if (selectedPeriod === TimePeriods.THIS_MONTH) {
          setVisitsData(enrichedTransformedData);
        }
      }

      setLoading(false);
    };

    fetchVisits();
  }, [selectedPeriod, userId, profile]);

  return (
    <Box>
      <Box pb={2} className={classes.visitsContainer}>
        <Accordion defaultExpanded>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1bh-content"
            id="panel1bh-header"
          >
            <Typography variant="body1" align="left">Visits Breakdown</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box>
              {profile && (
                <Box className={classes.totalVisits}>
                  <Typography variant="body1" align='center'>
                    {profile.visits || 0}
                  </Typography>
                  <Typography variant="body1" align='center'>Total Visits</Typography>
                </Box>
              )}

              {loading ? (
                <Box display="flex" flexDirection="column" alignItems="center" mt={4}>
                  <CircularProgress style={{ color: theme.palette.background.avatar }} />
                  <Typography variant="body1" align='center' mt={2}>Creating chart...</Typography>
                </Box>
              ) : (
                <Box>
                  <Box
                    mt={2}
                    gap={2}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Button
                      onClick={() => setSelectedPeriod(TimePeriods.THIS_WEEK)}
                      startIcon={selectedPeriod === TimePeriods.THIS_WEEK ? <CheckCircleIcon /> : undefined}
                    >
                      {TimePeriods.THIS_WEEK}
                    </Button>
                    <Button
                      onClick={() => setSelectedPeriod(TimePeriods.THIS_MONTH)}
                      startIcon={selectedPeriod === TimePeriods.THIS_MONTH ? <CheckCircleIcon /> : undefined}
                    >
                      {TimePeriods.THIS_MONTH}
                    </Button>
                  </Box>
                  {visitsData && visitsData.length === 0 ? (
                    <Alert severity="warning">Not enough data in the selected period to draw a chart.</Alert>
                  ) : (
                    <Box mt={2} width="100%" height={300}>
                      <ResponsiveContainer width="100%" height={300} className={classes.lineChartContainer}>
                        <LineChart data={visitsData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="visitedOn" />
                          <YAxis />
                          <Tooltip />
                          <Line type="monotone" dataKey="count" stroke={theme.palette.background.blue} activeDot={{ r: 8 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </Box>
                  )}
                </Box>
              )}
            </Box>
          </AccordionDetails>
        </Accordion>
      </Box>
    </Box>


  );
};

export default VisitsReport;