import * as React from "react";
import * as moment from "moment";
import { bind } from "bind-decorator";

import { renderRange, switchCase, updateState } from "react-ext";
import { dateFormat, noop } from "helpers";
import { Layout } from "layout";
import { importExportService } from "walletApi";

export interface ExportPageProps {
}

export interface ExportPageState {
    rangeType: string;
    rangeFrom: string;
    rangeTo: string;
    file: string;
    year: string;
    month: string;
}

export class ExportPage extends React.Component<ExportPageProps, ExportPageState> {
    rangeTypes = [{
        value: "1",
        name: "Year/Month"
    }, {
        value: "2",
        name: "From-To"
    }];
    constructor(props) {
        super(props);
        const now = moment();
        this.state = {
            rangeType: "1",
            file: "Export",
            month: (now.month() + 1).toString(),
            year: (now.year()).toString(),
            rangeFrom: now.startOf("month").format(dateFormat),
            rangeTo: now.endOf("month").format(dateFormat)
        };
    }

    @bind
    export(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const { file } = this.state;
        const { rangeFrom, rangeTo } = this.getRangeSelection();
        importExportService.exportRange(rangeFrom, rangeTo, file);
    }

    getRangeSelection() {
        const { rangeFrom, rangeTo, rangeType, month, year } = this.state;
        if (rangeType === "1") {
            const from = moment([parseInt(year, 10), parseInt(month, 10) - 1, 1]);
            return {
                rangeFrom: from.format(dateFormat),
                rangeTo: from.endOf("month").format(dateFormat)
            };
        }
        return { rangeFrom, rangeTo };
    }

    @bind
    handleInputChange(event: React.SyntheticEvent<HTMLFormElement>) {
        const state = updateState(event);
        this.setState(state);
    }

    @bind
    renderYearMonthSelector() {
        const { month, year } = this.state;
        return (
            <div className="card-body">
                <div className="form-group row">
                    <label htmlFor="year" className="col-sm-2 col-form-label">Year/Month</label>
                    <div className="col-sm-5">
                        <input type="number" className="form-control" name="year" value={year} onChange={noop} />
                    </div>
                    <div className="col-sm-5">
                        <select className="form-control" name="month" value={month} onChange={noop}>
                            {renderRange(1, 12, i => <option key={i}>{i}</option>)}
                        </select>
                    </div>
                </div>
            </div>
        );
    }

    @bind
    renderRangeSelector() {
        const { rangeFrom, rangeTo } = this.state;
        return (
            <div className="card-body">
                <div className="form-group row">
                    <label htmlFor="rangeFrom" className="col-sm-2 col-form-label">From</label>
                    <div className="col-sm-4">
                        <input type="date" className="form-control" name="rangeFrom" value={rangeFrom} onChange={noop} />
                    </div>
                    <label htmlFor="rangeFrom" className="col-sm-2 col-form-label">To</label>
                    <div className="col-sm-4">
                        <input type="date" className="form-control" name="rangeTo" value={rangeTo} onChange={noop} />
                    </div>
                </div>
            </div>
        );
    }

    render() {
        const { rangeType, file } = this.state;
        return (
            <Layout>
                <form onChange={this.handleInputChange} onSubmit={this.export}>
                    <div className="form-group row">
                        <label htmlFor="file" className="col-sm-2 col-form-label">Export file</label>
                        <div className="col-sm-10">
                            <input type="text" id="file" name="file" className="form-control" value={file} onChange={noop} />
                        </div>
                    </div>
                    <div className="form-group row">
                        <label htmlFor="rangeType" className="col-sm-2 col-form-label">Range type</label>
                        <div className="col-sm-10">
                            <select className="form-control" name="rangeType" value={rangeType} onChange={noop}>
                                {this.rangeTypes.map(v => <option key={v.value} value={v.value}>{v.name}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="card">
                        {
                            switchCase(rangeType, {
                                1: this.renderYearMonthSelector,
                                2: this.renderRangeSelector
                            })
                        }
                    </div>
                    <div className="form-group" style={{ marginTop: "0.5rem" }}>
                        <button type="submit" className="btn btn-primary">Download</button>
                    </div>
                </form>
            </Layout>
        );
    }
}
