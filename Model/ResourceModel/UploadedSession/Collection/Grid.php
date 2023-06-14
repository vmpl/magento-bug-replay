<?php declare(strict_types=1);

namespace VMPL\BugReplay\Model\ResourceModel\UploadedSession\Collection;

use Magento\Framework\Api\Search\SearchResultInterface;
use Magento\Framework\Api\SearchCriteriaInterface;
use VMPL\BugReplay\Model\ResourceModel\UploadedSession\Collection;

class Grid extends Collection implements SearchResultInterface
{
    public $_eventPrefix = 'vmpl_uploaded_session_grid';
    public $_eventObject = 'grid';
    protected \Magento\Framework\Api\Search\AggregationInterface $aggregations;

    public function __construct(
        \Magento\Framework\Data\Collection\EntityFactoryInterface    $entityFactory,
        \Psr\Log\LoggerInterface                                     $logger,
        \Magento\Framework\Data\Collection\Db\FetchStrategyInterface $fetchStrategy,
        \Magento\Framework\Event\ManagerInterface                    $eventManager,
        string                                                       $mainTable = 'vmpl_uploaded_sessions',
        \Magento\Framework\DB\Adapter\AdapterInterface               $connection = null,
        \Magento\Framework\Model\ResourceModel\Db\AbstractDb         $resource = null
    ) {
        parent::__construct(
            $entityFactory,
            $logger,
            $fetchStrategy,
            $eventManager,
            $connection,
            $resource
        );
        $this->setMainTable($mainTable);
    }

    protected function _construct()
    {
        $this->_init(
            \Magento\Framework\View\Element\UiComponent\DataProvider\Document::class,
            \VMPL\BugReplay\Model\ResourceModel\UploadedSession::class,
        );
    }

    public function setItems(array $items = null)
    {
        return $this;
    }

    public function getAggregations()
    {
        return $this->aggregations;
    }

    public function setAggregations($aggregations)
    {
        $this->aggregations = $aggregations;
        return $this;
    }

    public function getSearchCriteria()
    {
        return null;
    }

    public function setSearchCriteria(SearchCriteriaInterface $searchCriteria)
    {
        return $this;
    }

    public function getTotalCount()
    {
        return $this->getSize();
    }

    public function setTotalCount($totalCount)
    {
        return $this;
    }
}
