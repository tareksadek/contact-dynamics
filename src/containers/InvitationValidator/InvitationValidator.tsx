import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { AppDispatch } from '../../store/reducers';
import { RootState } from '../../store/reducers';
import { checkInvitationValidity } from '../../store/actions/userInvitation';

const InvitationValidator = () => {
	const dispatch = useDispatch<AppDispatch>();
	const navigate = useNavigate();
	const location = useLocation();

	const invitation = useSelector((state: RootState) => state.userInvitation.invitation);
	const error = useSelector((state: RootState) => state.userInvitation.error);

	useEffect(() => {
		// Extract tac value from the URL
		const params = new URLSearchParams(location.search);
		const tac = params.get('tac');

		if (tac) {
			const [invitationId, batchId] = tac.split('_');
			dispatch(checkInvitationValidity(batchId, invitationId));
		} else {
			// Handle the case where tac is not provided in the URL
			console.error('TAC not provided in the URL');
			navigate('/');
			// Possibly redirect or show an error message to the user
		}
	}, [dispatch, location.search, navigate]);

	useEffect(() => {
		if (invitation) {
			if (invitation.used) {
				if (invitation.usedBy) {
					// If usedBy is provided, redirect to the user's profile
					navigate(`/profile/${invitation.usedBy}`);
				} else {
					// Handle the case where usedBy is not provided though the invitation is used
					console.error('usedBy not provided in the invitation data');
					// You can decide to show an error or take some other action here
				}
			} else {
				// Invitation is not used, redirect to the create account page
				navigate('/createAccount');
			}
		}
	}, [invitation, navigate]);

	useEffect(() => {
		if (error) {
			navigate('/');
		}
	}, [error, navigate]);

	return (
		<div>
			{/* Possibly show a loading spinner while processing */}
			Checking your invitation...
		</div>
	);
}

export default InvitationValidator;