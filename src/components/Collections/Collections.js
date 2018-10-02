import React, { Component } from 'react';
import { COLORS } from '../../constants/Colors';
import { ICONS } from '../../constants/Icons';
import './Collections.css';

import CollectionsChart from './CollectionsChart';
import EditCollection from './EditCollection';
import Dropdown from '../Dropdown/Dropdown';
import Overlay from '../Overlay/Overlay';
import CollectionForm from '../Form/CollectionForm';
import Error from '../Error/Error';
import Icon from '../Icon/Icon';

class Collections extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showEditCollectionDialog: false,
      showDeleteConfirmation: false,
      datasets: [],
      collectionToEdit: {},
      collectionToDelete: ''
    };

    this.handleAddCollection = this.handleAddCollection.bind(this);
    this.handleRemoveCollection = this.handleRemoveCollection.bind(this);
    this.handleEditCollection = this.handleEditCollection.bind(this);
  }

  componentDidMount() {
    const userId = this.props.currentUser.user.id;

    if (!this.props.collections.length) {
      this.props.fetchCollections(userId);
    }

    this.props.fetchCollectionsAndValues(userId)
      .then(() => {
        this.setState({ collectionsAndValues: { ...this.props.collectionsAndValues } });
      });
  }

  componentWillReceiveProps(nextprops) {
    if (nextprops.expenses !== this.props.expenses || nextprops.incomes !== this.props.incomes || nextprops.collections.length !== this.props.collections.length) {
      const userId = this.props.currentUser.user.id;

      this.props.dataFetched(false);

      this.props.fetchCollectionsAndValues(userId)
        .then(() => {
          this.setState({ collectionsAndValues: { ...this.props.collectionsAndValues } });
        })
        .then(() => {
          this.props.dataFetched(true);
        });
    }
  }

  handleAddCollection(collection) {
    this.props.dataFetched(false);
    this.props.removeError();

    const allCollections = this.props.collections;
    
    const collectionExists = allCollections.find(coll => {
      return coll.title === collection.title;
    });

    if (!collectionExists) {
      this.props.newCollection(collection)
        .then(() => {
          this.props.dataFetched(true);
        });
    } else {
      this.props.dispatch(this.props.addError("A collection with the same name already exists. Please choose another name."));
      this.props.dataFetched(true);
    }
  }

  handleRemoveCollection(collection) {
    this.props.dataFetched(false);
    this.props.removeCollection(collection)
      .then(() => {
        this.props.dataFetched(true);
      });
  }

  handleEditCollection(collection) {
    this.props.dataFetched(false);
    this.setState({ showEditCollectionDialog: false });

    const allCollections = this.props.collections;

    let collectionsToLoop = [];
    for (let i = 0; i < allCollections.length; i++) {
      if (allCollections[i]._id !== this.state.collectionToEdit._id) {
        collectionsToLoop.push(allCollections[i]);
      }
    }
    
    const collectionExists = collectionsToLoop.find(coll => {
      return coll.title === collection.title;
    });

    if (!collectionExists) {
      const collectionToSend = {
        title: collection.title,
        isExpense: collection.isExpense,
        color: collection.collectionColor,
        _id: this.state.collectionToEdit._id
      };
  
      this.props.updateCollection(collectionToSend)
        .then(() => {
          this.props.dataFetched(true);
        });
    } else {
      this.props.dispatch(this.props.addError("A collection with the same name already exists. Please choose another name."));
      this.props.dataFetched(true);
    }
  }

  render() {
    const { showEditCollectionDialog, showDeleteConfirmation, collectionsAndValues, collectionToEdit } = this.state;
    const { collections, collectionsChartData, fetchCollectionsChartData, errors } = this.props;

    const collectionList = collections.map(coll => {
      let collectionSign = '';
      
      if (collectionsAndValues && collectionsAndValues[coll.title]) {
        collectionSign = collectionsAndValues[coll.title].isExpense ? '-' : '+';
      }

      return (
        <li className="collection-item" key={coll._id} id={coll._id}>
          <div className="collection-content">
            <h3 className="collection-title">
              {coll.title}
            </h3>
  
            <h3 className='collectionValue' style={{ color: coll.isExpense ? COLORS.RED : COLORS.GREEN }}>
              {collectionSign} { collectionsAndValues && collectionsAndValues[coll.title] ? collectionsAndValues[coll.title].value : ''}
            </h3>
  
            <div className="actionButtons">
  
              <button className="editBtn actionBtn" onClick={() => {
                this.setState({ showEditCollectionDialog: true, collectionToEdit: coll });
              }}>Edit Collection
                <Icon icon={ICONS.EDIT} color={COLORS.GRAY} size='20' />
              </button>
              <button className="removeBtn actionBtn" onClick={() => {
                this.setState({ showDeleteConfirmation: true, collectionToDelete: coll._id });
              }}>Remove Collection
                <Icon icon={ICONS.DELETE} color='rgb(255, 0, 0)' size='20' />
              </button>
  
            </div>
          </div>
  
          <hr />
        </li>
      )
    });

    const DeleteConfirmation = props => (
      <div className='confirmation'>
        <h3 className='confirmation-title'>Are you sure you want to delete this collection?</h3>
        <div className='confirmation-btn-group'>
          <button 
            className='confirmation-btn confirmation-btn-danger' 
            onClick={() => {
              this.handleRemoveCollection(this.state.collectionToDelete); 
              props.closeOverlay();
            }
          }>Confirm</button>
        </div>
      </div>
    );

    return (
      <section id="collections">
        <h2 className="section-title">Collections</h2>
        <hr />

        <Dropdown 
          title='Add Collection' 
          items={<CollectionForm handleData={this.handleAddCollection} firstLabel='Collection Title' {...this.props} />} />

          <Error errors={errors} />

        {
          collections.length > 0 ?
          (
            <div>
              <CollectionsChart 
                fetchCollectionsChartData={fetchCollectionsChartData} 
                collectionsChartData={collectionsChartData} 
                collectionsAndValues={collectionsAndValues}
                collections={collections} 
                expenses={this.props.expenses}
                incomes={this.props.incomes}
                currentUser={this.props.currentUser}
                dataFetched={this.props.dataFetched} />
              <Dropdown title='Show collections' items={collectionList} />
            </div>
          ) :
          <h4 className='guide'>It seems that you have no collections yet. That's ok! Just click the add button and you'll be ready in no time!</h4>
        }

        {
          showEditCollectionDialog ?
          (
            <EditCollection 
              closeOverlay={() => this.setState({ showEditCollectionDialog: false, collectionToEdit: {} })}
              handleRemoveCollection={() => this.handleRemoveCollection(collectionToEdit)}
              handleEditCollection={this.handleEditCollection}
              collectionToEdit={collectionToEdit}
              {...this.props} />
          ) : null
        }
        
        {
          showDeleteConfirmation ?
          (
            <Overlay 
              content={<DeleteConfirmation closeOverlay={() => this.setState({ showDeleteConfirmation: false, expenseToDelete: '' })} />}
              closeOverlay={() => this.setState({ showDeleteConfirmation: false, expenseToDelete: '' })}
              maxWidth='30%' />
          ) : null
        }
      </section>
    );
  }
}

export default Collections;