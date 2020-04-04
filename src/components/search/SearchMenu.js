import React, { Component } from 'react'
import Select from 'react-select'
import {findSites} from './SearchUtils'
import SiteComponent from '../sites/siteComponent'
import {myFirebase} from '../firebase/firebase'
import {getUserClaims, updateUserFavorites, getFavoritesIDs} from '../firebase/FirebaseUtilities'
// import ReactPaginate from 'react-paginate'
import { PaginatedList } from 'react-paginated-list'

const options = [
    { value: 'tags', label: 'Tags'},
    { value: 'country', label: 'Country'},
    { value: 'city', label: 'City'},
    { value: 'name', label: 'Name'}
]

class SearchMenu extends Component {

    constructor(props) {
        super(props);

        this.state = {
            userid: "",
            claim: "guest",
            searchVal: '',
            topDownValue: 'tags',
            siteList: [],
            favoriteList: [],
        }

        this.onSearchButtonClicked = this.onSearchButtonClicked.bind(this);
        this.updateSearchValue = this.updateSearchValue.bind(this);
        this.updateTopDownhValue = this.updateTopDownhValue.bind(this);
    };

    async onSearchButtonClicked(e) {
        e.preventDefault();

        console.log(this.state.searchVal)
        console.log(this.state.topDownValue)

        const result = await findSites(this.state.topDownValue, this.state.searchVal)
        console.log(result)
        this.setState({siteList: result})
    }

    updateSearchValue(e) {
      this.setState({searchVal: e.target.value})
    }

    updateTopDownhValue(e) {
      this.setState({topDownValue: e.value})
    }

    renderButton(sid) {
        if(this.state.claim !== "guest") {
            if(!this.state.favoriteList.includes(sid)) {
                return true
            }
        }
        return false
    }

    async addSiteToFavorites(sid) {
        var favorites = this.state.favoriteList
        favorites.push(sid)
        updateUserFavorites(this.state.userid, favorites)

        this.setState({favoriteList: favorites})
    }

    async componentDidMount(){
        //console.log(await getUserClaims())
        //this.setState({claim: await getUserClaims()});
        myFirebase.auth().onAuthStateChanged(async (user) => {
            if(user) {
                var siteList = await getFavoritesIDs(user.uid)
                this.setState({userid: user.uid, claim: await getUserClaims(user), favoriteList: siteList});
            }
            //get favorites from user and save to this.state.favoriteList
       })
    }
    render() {
        const { siteList } = this.state;
        // console.log(siteList);
        const mapping = (list) => list.map((site, i) => {
            return  <div key={i} >
                            <SiteComponent key={i} props={site}/>
                            {this.renderButton(site.id) && <button onClick={() => this.addSiteToFavorites(site.id)}>Add to favorites</button>}
                        </div>
        });
        //if site-id is not in favoritesList show button to add to favorites
      

        return (
            <div>
                {/* Search site form */}
                <form ref={this.form} id="search-form">
                    <div className="search-field">
                        <input ref={this.searchVal} onChange={this.updateSearchValue} type="text" required />
                    </div>
                    <Select ref={this.dropList} defaultValue={options[0]} onChange={this.updateTopDownhValue} options={options} />
                    <div>
                        <button onClick={this.onSearchButtonClicked}>Search</button>
                    </div>
                    <p className="error pink-text center-align"></p>
                </form>
                
                {/* Results */}
                <div className="container">
                    {siteList.length != 0 && <PaginatedList
                        list={siteList}
                        itemsPerPage={3}
                        renderList={mapping}/>}
                </div>
            </div>
        )    
    }
}

export default SearchMenu