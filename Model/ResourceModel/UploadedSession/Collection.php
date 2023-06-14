<?php declare(strict_types=1);

namespace VMPL\BugReplay\Model\ResourceModel\UploadedSession;

use Magento\Framework\Model\ResourceModel\Db\Collection\AbstractCollection;
use VMPL\BugReplay\Model\ResourceModel\UploadedSession as Resource;
use VMPL\BugReplay\Model\UploadedSession as Model;

class Collection extends AbstractCollection
{
    protected $_eventPrefix = 'vmpl_uploaded_session_collection';
    protected $_eventObject = 'collection';

    protected function _construct()
    {
        $this->_init(Model::class, Resource::class);
    }
}
