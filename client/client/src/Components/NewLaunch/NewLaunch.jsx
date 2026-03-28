import React, { useRef } from "react";
import "./NewLaunch.css";
import { newLaunchProducts } from "../../assets/assets.js";

const NewLaunch = () => {

  const scrollRef = useRef(null);

  const scrollLeft = () => {
    scrollRef.current.scrollBy({ left: -500, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current.scrollBy({ left: 500, behavior: "smooth" });
  };

  return (
    <section className="py-5 bg-light s">

      <div className="container">

        {/* Header */}
        <div className="text-center mb-5">
          <h6 className="color-changing-text text-uppercase text-secondary fw-semibold">
            Newly Launched
          </h6>

          <div className="rotating-star fs-4 my-2">✦</div>

          <h2 className="fw-bold">Exclusive Laminates</h2>

          <p className="text-muted">
            Inspired from Indian Folk Art
          </p>
        </div>

        <div className="position-relative">
          <div className="">
            <button className="carousel-arrow left " onClick={scrollLeft}>
              ❮
            </button>

            <button className="carousel-arrow right" onClick={scrollRight}>
              ❯
            </button>
          </div>

          <div
            className="row flex-nowrap overflow-auto gx-3 carousel-scroll mt-5"
            ref={scrollRef}
          >
            {newLaunchProducts.map((data, key) => (

              <div
                className="col-xl-2 col-lg-3 col-md-4 col-sm-6 col-6 pt-5"
                key={key}
              >
                <div className="new-launch-box card border-0 shadow-sm h-100 text-center p-3">

                  <div className="image-box mx-auto mb-3">
                    <img
                      src={data.imageUrl}
                      alt={data.productName}
                      className="img-fluid"
                    />
                  </div>

                  <p className="fw-medium small mb-0">
                    {data.productName}
                  </p>

                </div>
              </div>

            ))}
          </div>

        </div>

      </div>

    </section>
  );
};

export default NewLaunch;