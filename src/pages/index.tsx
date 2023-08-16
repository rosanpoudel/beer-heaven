import ItemCard from '@/components/ItemCard';
import { CardTypes } from '@/types/index.types';
import React, { useEffect, useState } from 'react';
import EmptyState from '@/components/EmptyState';
import { Button, Form, Modal } from 'react-bootstrap';

const Home = () => {
  const [dataList, setDataList] = useState([]);
  const [localDataList, setLocalDataList] = useState([]);
  const [apiDataList, setApiDataList] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [activePage, setActivePage] = useState(1);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    tagline: '',
    description: '',
  });

  // fetch api data
  const fetchData = async (page: string | Number) => {
    try {
      const url = `https://api.punkapi.com/v2/beers?page=${page}&per_page=${
        page == 1 ? 3 : 10
      }`;
      const response = await fetch(url);
      const data = await response.json();
      setApiDataList(apiDataList.concat(data));
      setDataList(apiDataList.concat(data));
    } catch (err) {
      console.log('error:', err);
    }
  };

  const handleTabChange = (type: string) => {
    setActiveTab(type);

    if (type == 'all') {
      setDataList(apiDataList);
    }

    if (type == 'my') {
      setDataList(localDataList);
    }
  };

  const handleLoadMore = () => {
    setActivePage(activePage + 1);
  };

  const clearFormData = () => {
    setFormData({
      name: '',
      tagline: '',
      description: '',
    });
  };

  const handleModalClose = () => {
    setAddModalOpen(false);
    clearFormData();
  };

  const handleModalOpen = () => {
    setAddModalOpen(true);
  };

  const handleFormValueChange = (value: string, type: string) => {
    setFormData({ ...formData, [type]: value });
  };

  const handleFormSubmit = () => {
    if (
      formData?.name?.length > 0 &&
      formData?.description?.length > 0 &&
      formData?.tagline?.length > 0
    ) {
      const list = [formData, ...localDataList];
      localStorage.setItem('beerData', JSON.stringify(list));
      setActiveTab('my');
      setLocalDataList(list);
      setDataList(list);
      setAddModalOpen(false);
      clearFormData();
    } else {
      alert('Please fill all fields');
    }
  };

  const extractIngredients = (ingredients: any) => {
    const maltNames = ingredients?.malt?.map((item: any) => item?.name);
    const hopsNames = ingredients?.hops?.map((item: any) => item?.name);

    let ingredientsString = null;
    if (maltNames && hopsNames) {
      ingredientsString = [...maltNames, ...hopsNames]?.join(', ');
    }

    return ingredientsString;
  };

  // handle data fetching
  useEffect(() => {
    fetchData(activePage);
  }, [activePage]);

  // local data
  useEffect(() => {
    const localData = localStorage.getItem('beerData');
    if (localData) {
      setLocalDataList(JSON.parse(localData));
    }
  }, []);

  return (
    <>
      {/* header */}
      <div className="top-bar mb-4">
        <div className="tabs-container">
          <div
            className={`tab-item ${activeTab == 'all' && 'active'}`}
            onClick={() => handleTabChange('all')}
          >
            All Beers
          </div>
          <div
            className={`tab-item ${activeTab == 'my' && 'active'}`}
            onClick={() => handleTabChange('my')}
          >
            My Beers
          </div>
        </div>

        <Button variant="primary" onClick={handleModalOpen}>
          Add a new beer
        </Button>
      </div>

      {/* main contents */}
      <div className="main-contents">
        {/* tab contents */}
        <div className="tab-contents">
          {dataList?.length > 0 ? (
            <div className="cards-wrapper">
              {dataList?.map(
                ({
                  name,
                  image_url,
                  description,
                  tagline,
                  ingredients,
                }: CardTypes) => {
                  return (
                    <ItemCard
                      name={name}
                      tagline={tagline}
                      description={description}
                      image_url={image_url || '/public/img/custom-beer.png'}
                      ingredients={
                        extractIngredients(ingredients) ||
                        'yeast, oak, wheat, potato'
                      }
                    />
                  );
                }
              )}
            </div>
          ) : (
            <EmptyState onClickHere={handleModalOpen} />
          )}
        </div>

        {/* load more */}
        {activeTab == 'all' && dataList?.length > 0 && (
          <div className="load-more" onClick={handleLoadMore}>
            Load More{' '}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="10"
              height="10"
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              className="bi bi-chevron-down"
              viewBox="0 0 16 16"
            >
              <path
                stroke-width="2"
                d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"
              />
            </svg>
          </div>
        )}

        {/* add modal */}
        <Modal show={addModalOpen} onHide={handleModalClose}>
          <div className="modal-contents">
            <h4 className="modal-title">Add a New Beer</h4>

            <Form className="add-form">
              <div className="form-img">
                <img
                  src="/public/img/custom-beer.png"
                  alt="custom beer image"
                />
              </div>
              <Form.Control
                value={formData?.name}
                onChange={(e) => handleFormValueChange(e.target.value, 'name')}
                type="text"
                placeholder="Beer name*"
                required
              />
              <Form.Control
                value={formData?.tagline}
                onChange={(e) =>
                  handleFormValueChange(e.target.value, 'tagline')
                }
                type="text"
                placeholder="Genre*"
                required
              />
              <Form.Control
                value={formData?.description}
                onChange={(e) =>
                  handleFormValueChange(e.target.value, 'description')
                }
                type="text"
                as="textarea"
                placeholder="Description*"
                required
              />
            </Form>

            <div className="action-btns">
              <Button variant="light" onClick={handleModalClose}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleFormSubmit}>
                Save
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </>
  );
};

export default Home;
