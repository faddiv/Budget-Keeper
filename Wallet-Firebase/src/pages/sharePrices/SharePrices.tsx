import React from "react";
import classNames from "classnames";
import { Layout } from "../../layout";
import { noop } from "../../helpers";

interface SharePricesProps {

}

export const SharePrices: React.FunctionComponent<SharePricesProps> = () => {
    return (
        <Layout>
            <h1>Cost per person</h1>
            <form onSubmit={noop}>
                <div className="form-group">
                    <div className="input-group">
                        <input
                            name="article"
                            lang="hu"
                            className={classNames("form-control", { "is-invalid": false })}
                            placeholder="Person"
                        />
                        <div className="input-group-append">
                            <button type="submit" className="btn btn-primary">Add</button>
                        </div>
                    </div>
                    <div className="invalid-feedback" style={{ display: "none" }}>
                        {"Hiba"}
                    </div>
                </div>
            </form>
            <div className="list-group">
                <div className="list-group-item">
                    <div className="d-flex w-100 justify-content-between">
                        <h5 className="mb-1">
                            <button className="btn btn-danger btn-sm">
                                <span className="fa fa-trash fa-xs"></span>
                            </button>
                            <span className="sp-li-title">Viktor</span>
                        </h5>
                        <small>10000 ft</small>
                    </div>
                    <ul className="list-group list-group-flush no-right-padding">
                        <li className="list-group-item list-group-item-light d-flex justify-content-between">
                            <div>Cras justo odio</div><small>1000</small>
                        </li>
                        <li className="list-group-item d-flex justify-content-between">
                            <div>Dapibus ac facilisis in</div><input className="borderless small" value="1000" />
                        </li>
                        <li className="list-group-item d-flex justify-content-between">
                            <div>Morbi leo risus</div><input className="borderless small" value="1000" />
                        </li>
                        <li className="list-group-item d-flex justify-content-between">
                            <form onSubmit={noop} style={{ width: "100%" }}>
                                <div className="form-row">
                                    <div className="col">
                                        <input className="form-control form-control-sm" placeholder="Item" />
                                    </div>
                                    <div className="col">
                                        <div className="input-group">
                                            <input
                                                name="price-for"
                                                lang="hu"
                                                className={classNames("form-control form-control-sm", { "is-invalid": false })}
                                                placeholder="Price"
                                            />
                                            <div className="input-group-append">
                                                <button type="submit" className="btn btn-secondary btn-sm">Add</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </li>
                    </ul>
                </div>

                <div className="list-group-item">
                    <div className="d-flex w-100 justify-content-between">
                        <h5 className="mb-1">
                            <button className="btn btn-danger btn-sm">
                                <span className="fa fa-trash fa-xs"></span>
                            </button>
                            <span className="sp-li-title">Bea</span>
                        </h5>
                        <small>10000 ft</small>
                    </div>
                    <ul className="list-group list-group-flush no-right-padding">
                        <li className="list-group-item list-group-item-light d-flex justify-content-between">
                            <div>Cras justo odio</div><small>1000</small>
                        </li>
                        <li className="list-group-item d-flex justify-content-between">
                            <div>Dapibus ac facilisis in</div><input className="borderless small" value="1000" />
                        </li>
                        <li className="list-group-item d-flex justify-content-between">
                            <div>Morbi leo risus</div><input className="borderless small" value="1000" />
                        </li>
                        <li className="list-group-item d-flex justify-content-between">
                            <form onSubmit={noop} style={{ width: "100%" }}>
                                <div className="form-row">
                                    <div className="col">
                                        <input className="form-control form-control-sm" placeholder="Item" />
                                    </div>
                                    <div className="col">
                                        <div className="input-group">
                                            <input
                                                name="price-for"
                                                lang="hu"
                                                className={classNames("form-control form-control-sm", { "is-invalid": false })}
                                                placeholder="Price"
                                            />
                                            <div className="input-group-append">
                                                <button type="submit" className="btn btn-secondary btn-sm">Add</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </li>
                    </ul>
                </div>

                <div className="list-group-item">
                    <div className="d-flex w-100 justify-content-between">
                        <h5 className="mb-1">
                            <button className="btn btn-danger btn-sm">
                                <span className="fa fa-trash fa-xs"></span>
                            </button>
                            <span className="sp-li-title">Joe</span>
                        </h5>
                        <small>10000 ft</small>
                    </div>
                    <ul className="list-group list-group-flush no-right-padding">
                        <li className="list-group-item list-group-item-light d-flex justify-content-between">
                            <div>Cras justo odio</div><small>1000</small>
                        </li>
                        <li className="list-group-item d-flex justify-content-between">
                            <div>Dapibus ac facilisis in</div><input className="borderless small" value="1000" />
                        </li>
                        <li className="list-group-item d-flex justify-content-between">
                            <div>Morbi leo risus</div><input className="borderless small" value="1000" />
                        </li>
                        <li className="list-group-item d-flex justify-content-between">
                            <form onSubmit={noop} style={{ width: "100%" }}>
                                <div className="form-row">
                                    <div className="col">
                                        <input className="form-control form-control-sm" placeholder="Item" />
                                    </div>
                                    <div className="col">
                                        <div className="input-group">
                                            <input
                                                name="price-for"
                                                lang="hu"
                                                className={classNames("form-control form-control-sm", { "is-invalid": false })}
                                                placeholder="Price"
                                            />
                                            <div className="input-group-append">
                                                <button type="submit" className="btn btn-secondary btn-sm">Add</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </li>
                    </ul>
                </div>
            </div>

            <h1>Shared costs</h1>
            <form onSubmit={noop}>
                <div className="form-group">
                    <div className="input-group">
                        <input
                            name="article"
                            lang="hu"
                            className={classNames("form-control", { "is-invalid": false })}
                            placeholder="Shared item"
                        />
                        <div className="input-group-append">
                            <button type="submit" className="btn btn-primary">Add</button>
                        </div>
                    </div>
                    <div className="invalid-feedback" style={{ display: "none" }}>
                        {"Hiba"}
                    </div>
                </div>
            </form>

            <div className="list-group">
                <div className="list-group-item">
                    <div className="d-flex w-100 justify-content-between">

                        <h5 className="mb-1">
                            <button className="btn btn-danger btn-sm">
                                <span className="fa fa-trash fa-xs"></span>
                            </button>
                            <span className="sp-li-title">Billiárd</span>
                        </h5>
                        <input className="borderless small" placeholder="Price" />
                    </div>
                    <ul className="list-group list-group-flush no-right-padding">
                        <li className="list-group-item d-flex justify-content-between">
                            <div>Viktor</div><input className="borderless small" value="1:30" />
                        </li>
                        <li className="list-group-item d-flex justify-content-between">
                            <div>Bea</div><input className="borderless small" value="2:00" />
                        </li>
                        <li className="list-group-item d-flex justify-content-between">
                            <div>Joe</div><input className="borderless small" value="2:00" />
                        </li>
                        <li className="list-group-item d-flex justify-content-between">
                            <form onSubmit={noop} style={{ width: "100%" }}>
                                <div className="form-row">
                                    <div className="col">
                                        <input className="form-control form-control-sm" placeholder="Item" />
                                    </div>
                                    <div className="col">
                                        <div className="input-group">
                                            <input
                                                name="price-for"
                                                lang="hu"
                                                className={classNames("form-control form-control-sm", { "is-invalid": false })}
                                                placeholder="Time"
                                            />
                                            <div className="input-group-append">
                                                <button type="submit" className="btn btn-secondary btn-sm">Add</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </li>
                    </ul>
                </div>

                <div className="list-group">
                    <div className="list-group-item">
                        <div className="d-flex w-100 justify-content-between">
                            <h5 className="mb-1">
                                <button className="btn btn-danger btn-sm">
                                    <span className="fa fa-trash fa-xs"></span>
                                </button>
                                <span className="sp-li-title">Bowling</span>
                            </h5>
                            <input className="borderless small" placeholder="Price" />
                        </div>
                        <ul className="list-group list-group-flush no-right-padding">
                            <li className="list-group-item d-flex justify-content-between">
                                <div>Viktor</div><input className="borderless small" value="1:30" />
                            </li>
                            <li className="list-group-item d-flex justify-content-between">
                                <div>Bea</div><input className="borderless small" value="2:00" />
                            </li>
                            <li className="list-group-item d-flex justify-content-between">
                                <div>Joe</div><input className="borderless small" value="2:00" />
                            </li>
                            <li className="list-group-item d-flex justify-content-between">
                                <form onSubmit={noop} style={{ width: "100%" }}>
                                    <div className="form-row">
                                        <div className="col">
                                            <input className="form-control form-control-sm" placeholder="Item" />
                                        </div>
                                        <div className="col">
                                            <div className="input-group">
                                                <input
                                                    name="price-for"
                                                    lang="hu"
                                                    className={classNames("form-control form-control-sm", { "is-invalid": false })}
                                                    placeholder="Time"
                                                />
                                                <div className="input-group-append">
                                                    <button type="submit" className="btn btn-secondary btn-sm">Add</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </li>
                        </ul>
                    </div>
                </div>

            </div>
        </Layout>
    );
};
