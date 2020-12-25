import React from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faUser, faHomeLg} from '@fortawesome/pro-solid-svg-icons';
import {faGlobe} from '@fortawesome/pro-regular-svg-icons';
import {faUsers, faBible} from '@fortawesome/pro-duotone-svg-icons';

const icons = {
	Home: faHomeLg,
	PrayerRequests: faGlobe,
	Groups: faUsers,
	Account: faUser,
	Bible: faBible,
};

const Icon = ({name, color}) => {
	return (
		<FontAwesomeIcon icon={icons[name]} style={{color: color}} size={20} />
	);
};

export default Icon;
