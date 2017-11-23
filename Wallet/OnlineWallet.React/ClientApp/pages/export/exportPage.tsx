import * as React from 'react';
import * as moment from "moment";

import { renderRange, switchCase } from 'common/misc';
import { bind, updateState } from 'walletCommon';
import { dateFormat } from 'common/models';
import { Layout } from 'layout';

export namespace ExportPage {
    export interface Props {
    }
    export interface State {
        rangeType: string;
        rangeFrom: string;
        rangeTo: string;
        file: string;
        year: string;
        month: string;
    }
}

export class ExportPage extends React.Component<ExportPage.Props, ExportPage.State> {
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
    handleInputChange(event: React.SyntheticEvent<HTMLFormElement>) {
        var state = updateState(event);
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
                        <input type="number" className="form-control" name="year" value={year} />
                    </div>
                    <div className="col-sm-5">
                        <select className="form-control" name="month" value={month}>
                            {renderRange(1, 12, i => <option>{i}</option>)}
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
                        <input type="date" className="form-control" name="rangeFrom" value={rangeFrom} />
                    </div>
                    <label htmlFor="rangeFrom" className="col-sm-2 col-form-label">To</label>
                    <div className="col-sm-4">
                        <input type="date" className="form-control" name="rangeTo" value={rangeTo} />
                    </div>
                </div>
            </div>
        );
    }

    render() {
        const { rangeType, file } = this.state;
        return (
            <Layout>
                <form onChange={this.handleInputChange}>
                    <div className="form-group row">
                        <label htmlFor="file" className="col-sm-2 col-form-label">Export file</label>
                        <div className="col-sm-10">
                            <input type="text" id="file" name="file" className="form-control" value={file} />
                        </div>
                    </div>
                    <div className="form-group row">
                        <label htmlFor="rangeType" className="col-sm-2 col-form-label">Range type</label>
                        <div className="col-sm-10">
                            <select className="form-control" name="rangeType" value={rangeType}>
                                {this.rangeTypes.map(v => <option key={v.value} value={v.value}>{v.name}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="card">
                        {
                            switchCase(rangeType, {
                                "1": this.renderYearMonthSelector,
                                "2": this.renderRangeSelector
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