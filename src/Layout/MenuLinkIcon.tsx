import InfoIcon from '@mui/icons-material/Info';
import DocumentScannerIcon from '@mui/icons-material/DocumentScanner';
import ImageIcon from '@mui/icons-material/Image';
import LinkIcon from '@mui/icons-material/Link';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import ContactsIcon from '@mui/icons-material/Contacts';
import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter';
import QrCodeIcon from '@mui/icons-material/QrCode';
import ShareIcon from '@mui/icons-material/Share';
import CallMissedOutgoingIcon from '@mui/icons-material/CallMissedOutgoing';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import EnergySavingsLeafIcon from '@mui/icons-material/EnergySavingsLeaf';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import LogoutIcon from '@mui/icons-material/Logout';
import PlaceHolderIcon from '@mui/icons-material/Star';

interface IconForLinkProps {
  linkfor: string;
}

const MenuLinkIcon = ({ linkfor }: IconForLinkProps) => {
  switch (linkfor) {
    case "basic info":
      return <InfoIcon />;
    case "about info":
      return <DocumentScannerIcon />;
    case "images":
      return <ImageIcon />;
    case "links":
      return <LinkIcon />;
    case "theme":
      return <ColorLensIcon />;
    case "contacts":
      return <ContactsIcon />;
    case "contactForm":
      return <FormatAlignCenterIcon />;
    case "qrcode":
      return <QrCodeIcon />;
    case "share":
      return <ShareIcon />;
    case "redirect":
      return <CallMissedOutgoingIcon />;
    case "account":
      return <ManageAccountsIcon />;
    case "impact":
      return <EnergySavingsLeafIcon />;
    case "analytics":
      return <AnalyticsIcon />;
    case "logout":
      return <LogoutIcon />;
    default:
      return <PlaceHolderIcon />; 
  }
}

export default MenuLinkIcon;