import React, { Component } from 'react';
import Overlay from '../Overlay/Overlay';
import EditCollectionForm from '../Form/EditCollectionForm';
import './EditCollection.css';

class EditCollection extends Component {
  constructor(props) {
    super(props);

    this.sendNewCollection = this.sendNewCollection.bind(this);
  }

  sendNewCollection(collection) {
    this.props.handleEditCollection(collection);
  }

  render() {
    const { closeOverlay, collectionToEdit } = this.props;

    const EditForm = () => (
      <EditCollectionForm
        firstLabel='New Title'
        firstInputPlaceholder={collectionToEdit.title}
        handleData={this.sendNewCollection}
        {...this.props} />
    );

    const EditDialog = () => (
      <div>
        <h2 className='dialog-title'>{collectionToEdit.title}</h2>
        <EditForm />
      </div>
    );

    return (
      <Overlay
        maxWidth='80vw'
        closeOverlay={closeOverlay} 
        content={<EditDialog />} />
    );
  }
}

export default EditCollection;