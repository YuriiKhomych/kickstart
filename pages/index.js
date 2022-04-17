import React, {Component} from "react";
import factory from "../ethereum/factory";
import {Button, Card} from "semantic-ui-react";
import 'semantic-ui-css/semantic.min.css';
import Layout from "../components/Layout";
import {Link} from '../routes';


class CampaignIndex extends Component {
    static async getInitialProps() {
        const campaigns = await factory.methods.getDeployedCampaigns().call();
        return {campaigns};
    }

    renderCampaigns() {
        const items = this.props.campaigns.map(address => {
            return {
                header: address,
                description: (
                    <Link route={`/campaigns/${address}`}>
                        <a>View Campaign</a>
                    </Link>
                ),
                fluid: true
            }
        });
        return <Card.Group items={items}/>;
    }

    render() {
        return (
            <Layout>
                <div>
                    <h3>Open campaigns</h3>
                    {this.renderCampaigns()}
                    <Link route="/campaigns/new">
                        <a>
                            <Button floated="right" content="Create Campaign" icon="add circle" primary/>
                        </a>
                    </Link>

                </div>
            </Layout>
        )
    }
}

export default CampaignIndex;
