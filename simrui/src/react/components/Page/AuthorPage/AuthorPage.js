import React, { Component } from 'react';
import './AuthorPage.scss';
import AuthorsBooksTable from './AuthorsTable';
import { Link } from 'react-router-dom';

const Lib = require('./../../../Lib/componentUtils');
const Config = require('Config');
const queryString = require('query-string');

class AuthorPage extends Component {
    constructor(props) {
        super(props);

        const data = this.getDefaultData();

        this.state = {
            isInitByAuthorData: false,
            gotApiError: false,
            hasErrors: false,
            response: {
                code: -1,
                data: data
            }
        };

        const queryParameters = queryString.parse(this.props.location.search);
        this.id = queryParameters.id;
    }

    componentDidMount() {
        if (this.id) {
            Lib.fetchAndHandle({
                uri: Config.apiurl.author.get,
                data: {
                    id: this.id
                },
                method: 'GET',
                onSuccess: json => {
                    this.setState({
                        response: JSON.parse(json),
                        isInitByAuthorData: true
                    });
                },
                onError: this.onError
            });
        }
    }

    onError = err =>
        this.setState({
            gotApiError: true,
            hasErrors: true,
            isInitByAuthorData: false
        });

    getDefaultData() {
        return {
            name: {
                givenName: 'Loading...',
                fullMiddleName: 'Loading...',
                familyName: 'Loading...',
                key: 0
            },
            pseudonym: {
                givenName: 'Loading...',
                fullMiddleName: 'Loading...',
                familyName: 'Loading...',
                key: 0
            },
            aka: 'Loading...'
        };
    }

    getActions() {
        return (
            <div className="simr-book-page-actions simr-flex simr-flex-justify-space-between">
                <span className="simr-btn">Add new author</span>

                <div>
                    <Link to={Config.url.author}>
                        <span className="simr-btn">All authors</span>
                    </Link>
                    <Link to={Config.url.book}>
                        <span className="simr-btn">All books</span>
                    </Link>
                </div>
            </div>
        );
    }

    getAuthor() {
        let pseudonym;
        if (!this.id) {
            return;
        }

        if (this.state.response.data.pseudonym) {
            pseudonym = (
                <div className="simr-author-pseudonym">
                    <span>Pseudonym:</span>
                    <span>{this.state.response.data.pseudonym.familyName}</span>
                    <span>
                        {this.state.response.data.pseudonym.fullMiddleName}
                    </span>
                    <span>{this.state.response.data.pseudonym.givenName}</span>
                </div>
            );
        }

        let name;
        if (this.state.response.data.pseudonym) {
            name = (
                <span className="simr-author-name">
                    <span>{this.state.response.data.name.familyName}</span>
                    <span>{this.state.response.data.name.fullMiddleName}</span>
                    <span>{this.state.response.data.name.givenName}</span>
                </span>
            );
        }

        return (
            <span className="simr-author simr-grid-container">
                {name}
                {pseudonym}
                <span className="simr-author-aka">
                    As known as: {this.state.response.data.aka}
                </span>

                <img
                    className="simr-author-photo"
                    src={this.state.response.data.photoUrl}
                    alt="author"
                />
                <span className="simr-author-info">
                    {this.state.response.data.info}
                </span>
            </span>
        );
    }

    getLoader() {
        let loaderClass =
            'simr-flex simr-flex-align-center simr-flex-justify-center';

        if (this.state.gotApiError) {
            loaderClass += ' simr-loader-api-error ';
        }

        if (this.state.isInitByAuthorData || !this.id) {
            loaderClass += ' simr-loader hidden ';
        } else {
            loaderClass += ' simr-loader ';
        }

        const loader = (
            <div className={loaderClass}>
                <div className="sk-folding-cube">
                    <div className="sk-cube1 sk-cube" />
                    <div className="sk-cube2 sk-cube" />
                    <div className="sk-cube4 sk-cube" />
                    <div className="sk-cube3 sk-cube" />
                </div>
            </div>
        );
        return loader;
    }

    render() {
        const loader = this.getLoader();
        const actions = this.getActions();
        const author = this.getAuthor();

        return (
            <div>
                {loader}
                {actions}
                {author}
                <div className="simr-author-books">
                    <AuthorsBooksTable authorId={this.id} />
                </div>
            </div>
        );
    }
}

export default AuthorPage;
