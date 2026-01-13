import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import type { DataTableSelectionMultipleChangeEvent, DataTableStateEvent } from 'primereact/datatable';
import { Column } from 'primereact/column';
import CustomSelection from './CustomSelection';
import './index.css';

interface Artwork {
    id: number;
    title: string;
    place_of_origin: string;
    artist_display: string;
    inscriptions: string;
    date_start: number;
    date_end: number;
}

const App: React.FC = () => {
    const [artworks, setArtworks] = useState<Artwork[]>([]);
    const [totalRecords, setTotalRecords] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);
    const [page, setPage] = useState<number>(1);
    const [selectedRows, setSelectedRows] = useState<Artwork[]>([]);
    const [pendingCount, setPendingCount] = useState<number>(0);

    const fetchData = async (targetPage: number) => {
        setLoading(true);
        try {
            const res = await fetch(`https://api.artic.edu/api/v1/artworks?page=${targetPage}&limit=12`);
            const json = await res.json();
            setArtworks(json.data);
            setTotalRecords(json.pagination.total);
        } catch (err) {
            console.error("Fetch Error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData(page);
    }, [page]);

    // Logic to select rows across pages automatically
    useEffect(() => {
        if (pendingCount > 0 && artworks.length > 0) {
            const currentIds = new Set(selectedRows.map(r => r.id));
            const toAdd: Artwork[] = [];
            let remaining = pendingCount;

            for (const item of artworks) {
                if (remaining <= 0) break;
                if (!currentIds.has(item.id)) {
                    toAdd.push(item);
                    remaining--;
                }
            }

            if (toAdd.length > 0) {
                setSelectedRows(prev => [...prev, ...toAdd]);
                setPendingCount(remaining);
            }
        }
    }, [artworks, pendingCount]);

    const handleCustomSelection = (requested: number) => {
        const currentIds = new Set(selectedRows.map(r => r.id));
        const toAdd: Artwork[] = [];
        let remaining = requested;

        for (const item of artworks) {
            if (remaining <= 0) break;
            if (!currentIds.has(item.id)) {
                toAdd.push(item);
                remaining--;
            }
        }
        setSelectedRows(prev => [...prev, ...toAdd]);
        setPendingCount(remaining);
    };

    // Paginator Template with text labels
    const paginatorLeft = (
        <span className="p-paginator-current text-sm text-gray-500 font-normal">
            Showing {(page - 1) * 12 + 1} to {Math.min(page * 12, totalRecords)} of {totalRecords} entries
        </span>
    );

    const paginatorTemplate = {
        layout: 'FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink',
        'FirstPageLink': (options: any) => (
            <button type="button" className={options.className} onClick={options.onClick} disabled={options.disabled}>
                <span className="px-2">First</span>
            </button>
        ),
        'PrevPageLink': (options: any) => (
            <button type="button" className={options.className} onClick={options.onClick} disabled={options.disabled}>
                <span className="px-2">Previous</span>
            </button>
        ),
        'NextPageLink': (options: any) => (
            <button type="button" className={options.className} onClick={options.onClick} disabled={options.disabled}>
                <span className="px-2">Next</span>
            </button>
        ),
        'LastPageLink': (options: any) => (
            <button type="button" className={options.className} onClick={options.onClick} disabled={options.disabled}>
                <span className="px-2">Last</span>
            </button>
        )
    };

    return (
        <div className="main-layout">
            <div className="table-card">
                <DataTable
                    value={artworks}
                    lazy
                    paginator
                    rows={12}
                    totalRecords={totalRecords}
                    first={(page - 1) * 12}
                    onPage={(e: DataTableStateEvent) => setPage((e.page ?? 0) + 1)}
                    loading={loading}
                    selection={selectedRows}
                    onSelectionChange={(e: DataTableSelectionMultipleChangeEvent<Artwork[]>) => setSelectedRows(e.value)}
                    selectionMode="multiple"
                    dataKey="id"
                    className="custom-table"
                    paginatorTemplate={paginatorTemplate}
                    paginatorLeft={paginatorLeft}
                >
                    <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} />
                    <Column 
                        field="title" 
                        header={
                            <div className="flex items-center gap-1">
                                <CustomSelection onSelect={handleCustomSelection} />
                                <span>TITLE</span>
                            </div>
                        } 
                    />
                    <Column field="place_of_origin" header="PLACE OF ORIGIN" />
                    <Column field="artist_display" header="ARTIST" />
                    <Column field="inscriptions" header="INSCRIPTIONS" body={(d) => d.inscriptions || 'N/A'} />
                    <Column field="date_start" header="START DATE" />
                    <Column field="date_end" header="END DATE" />
                </DataTable>
            </div>
        </div>
    );
};

export default App;