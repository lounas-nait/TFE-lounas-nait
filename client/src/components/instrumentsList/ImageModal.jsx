

import React from 'react';

const ImageModal = ({ handleCloseImageModal, selectedInstrument, selectedImageIndex }) => {
  return (
    <div className="fixed top-0 left-0  w-full h-full bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 h-[600px] w-[900px] rounded-md relative">
        <button onClick={handleCloseImageModal} className="absolute top-0 right-0 m-2 p-2 text-gray-600 hover:text-gray-800">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <img src={selectedInstrument.images[selectedImageIndex].url} alt="" className="w-full h-full object-contain" />
      </div>
    </div>
  );
};

export default ImageModal;
