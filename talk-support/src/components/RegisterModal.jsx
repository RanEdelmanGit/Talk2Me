import React, {useState} from 'react'
import Modal from '../components/common/Modal'
import ClientRegistration from './auth/ClientRegistration';

export default function RegisterModal() {
    const [isModalOpen, setModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState(null);
  
    const handleOpenModal = (content) => {
      setModalContent(content);
      setModalOpen(true);
    };
  
    const handleCloseModal = () => {
      setModalOpen(false);
      setModalContent(null);
    };
  
  return (
    <div className='font-semibold' dir='rtl'><h2>לאחר מילוי הפרטים הבאים הזהות והשיחות שלך יישארו אנונימיים, ויוצגו רק המידע הרלוונטי למצבך. הזהות האישית שלך תישאר פרטית עד שתבחר לחשוף אותה או להחליף פרטי התקשרות עם התומך שלך.
    אנו מאמינים שלכל אחד מגיעה הזכות להישמע ולקבל תמיכה. השאלון הזה מינימלי ונועד לעזור לתומכים שלנו להבין מה הכי חשוב לך, כדי שיוכלו לספק את התמיכה הטובה ביותר מבלי לדעת פרטים אישיים שלך.
    תודה שלקחת את הזמן לענות על השאלות הללו. המסע שלך לקראת בריאות נפשית טובה יותר מתחיל כאן.
    </h2>
    <button className="bg-green-200 text-green-700 px-4 py-2 rounded mt-6"  onClick={() => handleOpenModal(<ClientRegistration />)}>
    המשך להרשמה
    </button>

    <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        {modalContent}
      </Modal>
    </div>
  )
}
