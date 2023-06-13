import React from 'react';

const DeleteModal = ({deleteId, deleteConfirm}) => {
    // console.log(deleteId);
    return (
        <div className='modal fade' id='deleteModal' data-bs-backdrop="static" data-bs-keyboard="false">
            <div className="modal-dialog modal-sm modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-body">
                        <h6 className='text-center'>Are your sure want to delete this?</h6>
                        <div className='mt-3 d-flex justify-content-between'>
                            <button className='btn btn-success btn-sm'  onClick={()=>deleteConfirm(true)} data-bs-dismiss="modal">Confirm</button>
                            <button className='btn btn-danger btn-sm' data-bs-dismiss="modal"  onClick={()=>deleteConfirm(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeleteModal;