'use client';
import { useEffect, useState, use } from 'react';
import axios from 'axios';

const C = { primary: '#5252C9', card: '#E9EEF7', accent: '#B4D1FB', deep: '#0B0B60' };

export default function VerifyPage({ params }) {
    // ✅ unwrap params in Next.js 15+
    const { token } = use(params);

    const API = process.env.NEXT_PUBLIC_BACKEND_BASE || 'http://localhost:4000';

    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState('');
    const [data, setData] = useState(null);

    useEffect(() => {
        (async () => {
            setLoading(true);
            setErr('');
            try {
                const r = await axios.get(`${API}/api/gov/verify/${token}`);
                setData(r.data?.data);
            } catch (e) {
                setErr(e?.response?.data?.errors?.message || e.message || 'Failed to load');
            } finally {
                setLoading(false);
            }
        })();
    }, [token]);

    async function decide(decision) {
        if (!confirm(`Are you sure you want to ${decision.toUpperCase()} this document?`)) return;
        try {
            const r = await axios.post(`${API}/api/gov/verify/${token}/decision`, { decision });
            alert(r.data?.message || 'Done');
            window.location.reload();
        } catch (e) {
            alert(e?.response?.data?.errors?.message || e.message || 'Failed');
        }
    }

    if (loading) return <div style={{ padding: 24 }}>Loading…</div>;
    if (err) return <div style={{ padding: 24, color: 'crimson' }}>{err}</div>;
    if (!data) return <div style={{ padding: 24 }}>No data</div>;

    return (
        <div style={{ maxWidth: 980, margin: '24px auto', padding: '0 16px' }}>
            <div style={{ background: C.card, borderRadius: 16, padding: 20, boxShadow: '0 6px 18px rgba(0,0,0,0.06)' }}>
                <h2 style={{ marginTop: 0, color: C.primary }}>Verify Document</h2>
                <p><b>Application No:</b> {data.applicationNo}</p>
                <p><b>Document:</b> {data.docName}</p>

                <div style={{ border: '1px solid #ddd', borderRadius: 12, overflow: 'hidden', margin: '16px 0' }}>
                    <iframe src={data.docLink} title="Document" style={{ width: '100%', height: '72vh', border: 0 }} />
                </div>

                <div style={{ display: 'flex', gap: 12 }}>
                    <button
                        onClick={() => decide('approve')}
                        style={{ background: C.primary, color: '#fff', border: 'none', padding: '12px 18px', borderRadius: 12, cursor: 'pointer' }}
                    >
                        Approve
                    </button>
                    <button
                        onClick={() => decide('reject')}
                        style={{ background: C.deep, color: '#fff', border: 'none', padding: '12px 18px', borderRadius: 12, cursor: 'pointer' }}
                    >
                        Reject
                    </button>
                </div>
            </div>
        </div>
    );
}
