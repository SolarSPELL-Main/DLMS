import { isEqual } from "lodash"

//Object that contains templates for API endpoints
//URLs that dont take an id example:    APP_URLS.DIRLAYOUT_LIST
//URLs that take an id example:         APP_URLS.DIRLAYOUT_DETAIL(id)
const APP_URLS = {
    CONTENTS_LIST: '/api/contents/',
    CONTENT_DETAIL: (id) => `/api/contents/${id}/`,
    DIRLAYOUT_LIST: '/api/dirlayouts/',
    DIRLAYOUT_DETAIL: (id) => `/api/dirlayouts/${id}/`,
    DIRLAYOUT_CLONE: (id) => `/api/dirlayouts/${id}/clone/`,
    DIRECTORY_LIST: '/api/directories/',
    DIRECTORY_DETAIL: (id) => `/api/directories/${id}/`,
    ALLTAGS_LIST: '/api/alltags/',
    CREATORS_LIST: '/api/creators/',
    CREATORS_DETAIL: (id) => `/api/creators/${id}/`,
    COVERAGES_LIST: '/api/coverages/',
    COVERAGES_DETAIL: (id) => `/api/coverages/${id}/`,
    COLLECTIONS_LIST: '/api/collections/',
    COLLECTIONS_DETAIL: (id) => `/api/collections/${id}/`,
    SUBJECTS_LIST: '/api/subjects/',
    SUBJECTS_DETAIL: (id) => `/api/subjects/${id}/`,
    KEYWORDS_LIST: '/api/keywords/',
    KEYWORDS_DETAIL: (id) => `/api/keywords/${id}/`,
    WORKAREAS_LIST:'/api/workareas/',
    WORKAREAS_DETAIL: (id) => `/api/workareas/${id}/`,
    LANGUAGES_LIST:'/api/languages/',
    LANGUAGES_DETAIL: (id) => `/api/languages/${id}/`,
    CATALOGERS_LIST:'/api/catalogers/',
    CATALOGERS_DETAIL: (id) => `/api/catalogers/${id}/`,
    START_BUILD: (id) => `/api/dirlayouts/${id}/build/`,
    VIEW_BUILD: '/api/builds/',
    DISKSPACE: '/api/diskspace/',
    METADATA_UPLOAD: '/api/metadata/',
    METADATA_MATCH: '/api/metadata_match',
};

//Returns a pagination query string that can be appended to an URL
//APP_URLS.DIRLAYOUT_LIST + get_pagination_query(5, 3) == "/api/dirlayouts/?page=5&size=3"
const get_pagination_query = (page=0, size=10) => `?page=${page}&size=${size}`

const FILTER_PARAMS = {
    CONTENTS: {
        'name': ['icontains'],
        'description': ['icontains'],
        'updated_time': ['gte', 'lte'],
        'creators': ['in'],
        'coverage': ['in'],
        'subjects': ['in'],
        'keywords': ['in'],
        'workareas': ['in'],
        'language': ['in'],
        'cataloger': ['in'],
        'collections': ['in'],
        'active': [null]
    }
}

const get_filter_param = (name, op, value) => `${name}${op ? "__" + op : ""}=${encodeURIComponent(value)}`

//Takes a devexpress grid filter array and turns it into a string that can be appended to a pagination url
const get_filter_query = (filters, viewset_params) => {
    return filters.map(filter => {
        const { name, val } = filter
        const operations = viewset_params[name]
        if (isEqual(operations, ['in'])) {
            return get_filter_param(name, operations[0], val.join(","))
        } else if (isEqual(operations, ['lte', 'gte'])) {
            //Turns filter.value == '12/19/2019-12/21/2019' into dates == ['12-19-2019', '12-21-2019']
            const dates = val.split("-").map(date => date.replace(/\//g, '-'))
            return dates.length !== 2 ? null : operations.map((op, idx) => get_filter_param(name, op, dates[idx])).join("&")
        } else if (name == "active") {
            return get_filter_param(name, operations[0], val ? 1 : 0)
        }
        return get_filter_param(name, operations[0], val)
    }).filter(val => val !== null).join("&")
}

export {
    FILTER_PARAMS,
    APP_URLS,
    get_pagination_query,
    get_filter_query
};