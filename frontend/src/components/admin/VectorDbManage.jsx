import { useState } from 'react';
import { loadVectorDb, clearVectorDb } from '../../api/vectorDbApi';
import './AdminStyles.css';

const VectorDbManage = () => {
    const [loading, setLoading] = useState(null); // 'load' | 'clear' | null
    const [message, setMessage] = useState(null); // { type: 'success'|'error', text: '' }

    const handleLoad = async () => {
        setLoading('load');
        setMessage(null);
        try {
            const res = await loadVectorDb();
            setMessage({ type: 'success', text: res.data.message || 'Đã đẩy dữ liệu lên vector database thành công!' });
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Lỗi khi đẩy dữ liệu.' });
        } finally {
            setLoading(null);
        }
    };

    const handleClear = async () => {
        setLoading('clear');
        setMessage(null);
        try {
            const res = await clearVectorDb();
            setMessage({ type: 'success', text: res.data.message || 'Đã xoá dữ liệu trong vector database!' });
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Lỗi khi xoá dữ liệu.' });
        } finally {
            setLoading(null);
        }
    };

    return (
        <div className="admin-container">
            <h2 className="admin-title">
                <i className="bi bi-database-gear me-2"></i>
                Vector Database Management
            </h2>
            <p className="text-muted mb-4">
                Quản lý dữ liệu trong Pinecone vector database phục vụ tìm kiếm AI.
                Sau khi thêm/sửa sách, hãy chạy "Load Data" để đồng bộ.
            </p>

            {message && (
                <div className={`alert alert-${message.type === 'success' ? 'success' : 'danger'} d-flex align-items-center`}>
                    <i className={`bi ${message.type === 'success' ? 'bi-check-circle' : 'bi-exclamation-triangle'} me-2`}></i>
                    {message.text}
                </div>
            )}

            <div className="row g-4">
                <div className="col-md-6">
                    <div className="card border-primary h-100">
                        <div className="card-body text-center py-5">
                            <i className="bi bi-cloud-arrow-up" style={{ fontSize: '3rem', color: '#0d6efd' }}></i>
                            <h5 className="card-title mt-3">Load Data</h5>
                            <p className="card-text text-muted">
                                Đọc toàn bộ sách từ database và đẩy lên Pinecone.
                                Dữ liệu cũ sẽ bị xoá trước khi ghi mới.
                            </p>
                            <button
                                className="btn btn-primary px-4"
                                onClick={handleLoad}
                                disabled={loading !== null}
                            >
                                {loading === 'load' ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2"></span>
                                        Đang đẩy dữ liệu...
                                    </>
                                ) : (
                                    <>
                                        <i className="bi bi-cloud-arrow-up me-2"></i>
                                        Load Data
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="card border-danger h-100">
                        <div className="card-body text-center py-5">
                            <i className="bi bi-cloud-slash" style={{ fontSize: '3rem', color: '#dc3545' }}></i>
                            <h5 className="card-title mt-3">Clear Data</h5>
                            <p className="card-text text-muted">
                                Xoá toàn bộ dữ liệu trong Pinecone index.
                                Hành động này không thể hoàn tác!
                            </p>
                            <button
                                className="btn btn-danger px-4"
                                onClick={handleClear}
                                disabled={loading !== null}
                            >
                                {loading === 'clear' ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2"></span>
                                        Đang xoá...
                                    </>
                                ) : (
                                    <>
                                        <i className="bi bi-trash3 me-2"></i>
                                        Clear Data
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VectorDbManage;
