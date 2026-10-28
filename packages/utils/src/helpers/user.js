import { CIAM_REFRESH_TOKEN } from '../../../constants';
import { getLocalStorage } from '../../localStorageUtils';
import Cookies from './cookies';

export const isLoggedInUser = () => !!getLocalStorage(CIAM_REFRESH_TOKEN)?.refreshCiamToken;

export const isLoggedInUserV2 = ({ loginCookieName = 'isLoggedInUser' } = {}) =>
  Cookies.get(loginCookieName) === 'true';

export const getUserDetails = async () => {
  try {
    // Only fetch details for logged-in users
    if (!isLoggedInUserV2()) {
      return null;
    }

    if (typeof window !== 'undefined' && typeof window.fetchUserDetails === 'function') {
      return await window.fetchUserDetails();
    }

    return null;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const isLoyaltyUserV2 = async () => {
  const userDetails = await getUserDetails();
  return !!userDetails?.ffn?.trim();
};

// Utility function to get CPolicy from window.skpv2 object
export const getCPolicy = () => {
  if (typeof window !== 'undefined' && typeof window.skpv2?.getCPolicy === 'function') {
    let policyName = window.skpv2.getCPolicy();
    let updatedPolicyName = policyName.replace(/^['"]|['"]$/g, ''); //API does not support quotes
    return updatedPolicyName;
  }
  return null;
};

// Utility function to fetch all details inside u_data cookie
export const getUData = () => {
  try {
    const uDataCookie = Cookies.get('u_data');
    if (!uDataCookie) return null;
    return JSON.parse(decodeURIComponent(uDataCookie));
  } catch {
    return null;
  }
};

export const loginPopFunction = () => {
  document.dispatchEvent(
    new CustomEvent('toggleLoginPopupEvent', {
      bubbles: true,
      detail: {
        loginType: 'loginSSOPopup',
        persona: 'Member',
      },
    }),
  );
};

export const openLoyaltyPopup = async () => {
  try {
    const customerData = await getUserDetails();

    if (!customerData) {
      throw new Error('User info is unavailable');
    }

    const eventDetails = {
      bubbles: true,
      detail: {
        loginType: 'EnrollSSOloyalty',
        persona: 'Member',
        isLoggedIn: true,
        authUserCookie: customerData,
        isLoyaltyMember: !!(
          customerData.loyaltyMemberInfo?.FFN || customerData.loyaltyMemberInfo?.ffn
        ),
        prefillData: {
          firstName: customerData.firstName || customerData.name?.first || '',
          lastName: customerData.lastName || customerData.name?.last || '',
          date: customerData.dob || '',
          email: customerData.emailId || '',
          phone: customerData.mobileNumber || '',
          gender:
            customerData.title === 'MR' || customerData.name?.title === 'MR' ? 'Male' : 'Female',
          loyaltyMemberInfo: customerData.loyaltyMemberInfo || {},
        },
      },
    };

    document.dispatchEvent(new CustomEvent('toggleLoginPopupEvent', eventDetails));
  } catch (error) {
    console.error('Error opening loyalty popup:', error);
  }
};

export const getSessionData = () => {
  if (typeof window !== 'undefined' && typeof window.skpv2?.getSessionData === 'function') {
    return window.skpv2.getSessionData();
  }
  return null;
};
