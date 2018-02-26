import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';
import { News } from '../selectors';
import './Home.css';
import logo from '../img/logo.png';

class NewsItem extends Component {
  render() {
    return (
      <div className="card news-item">
        <div className="card-body">
          <h5 className="card-title">{this.props.title}</h5>
          <h6 className="card-subtitle mb-2 text-muted">{this.props.date} by {this.props.author}</h6>
          {this.props.children}
        </div>
      </div>
    )
  }
}

const propTypes = {
  fetchNewsItems: PropTypes.func.isRequired,
  hasFetchedNews: PropTypes.bool.isRequired,
  isFetchingNews: PropTypes.bool.isRequired,
  newsItems: PropTypes.array.isRequired,
};

const mapStateToProps = state => ({
  hasFetchedNews: News.isFetching(state.news),
  isFetchingNews: News.hasFetched(state.news),
  newsItems: News.getItems(state.news),
});

export class HomePage extends Component {
  componentDidMount() {
    const { fetchNewsItems, hasFetchedNews } = this.props;
    if (!hasFetchedNews) {
      fetchNewsItems(0, 3);
    }
  }

  render() {
    const renderNewsList = () => {
      const { newsItems } = this.props;
      if (newsItems) {
        return newsItems.map((newsItem, index) => {
          return (
            <NewsItem key={index} title={newsItem.title} date={newsItem.date} author={newsItem.date}>
              <div dangerouslySetInnerHTML={{ __html: newsItem.content }} />
            </NewsItem>
          )
        })
      } else {
        return (<div>Refreshing news items...</div>)
      }
    }
    return (
      <React.Fragment>
        <div id="home-banner" className="container page-banner page-banner-home">
          <div className="promo">
            <img src={logo} alt="OpenRCT2" />
            <strong>OpenRCT2</strong> is an open source re-implementation of RollerCoaster Tycoon 2.
            </div>
        </div>
        <div className="container container-main">
          <div className="row">
            <div className="col-8">
              <h2>News</h2>
              {renderNewsList()}
            </div>
            <div className="col">
              <a className="no-link-decor" href="https://openrct2.org">
                <div id="home-download-button">
                  <i className="fa fa-download"></i> Download <strong>OpenRCT2</strong>
                </div>
              </a>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

HomePage.propTypes = propTypes;
HomePage = connect(mapStateToProps, actions)(HomePage);
