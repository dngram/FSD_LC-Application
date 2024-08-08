#include<iostream>
#include<algorithm>
using namespace std;
//test lololololn,mn,mn,mn,n,mn,darshan's edit, homeless ppl in da houseee
//ddfhgiahgfuguiefhg
//hhhhhhhhhhhhhhhhh
class node
{
    int data;
    node *left,*right;
    friend class AVL_Tree;
};

class AVL_Tree
{
    node *root;
public:
    AVL_Tree()
    {
        root = NULL;
    }
    void Create_AVL();
    node *insert(node *root, int key);
    node *LLRot(node *);
    node *LRRot(node *); 
    node *RRRot(node *); 
    node *RLRot(node *);
    node *Balance(node *);
    int BF(node *);
    int ht(node *);
    void Rec_Inorder(node *);
    void Rec_Inorder(); 
};

void AVL_Tree::Create_AVL()
{
    char ch;
    int key;
    do
    {
        cout << "Enter data" << endl;
        cin >> key;
        root = insert(root, key);
        cout << "Do you want to continue?" << endl;
        cin >> ch;
    } while (ch == 'Y');
}

node* AVL_Tree::insert(node *root, int key)
{
    if (root == NULL)
    {
        root = new node();
        root->data = key;
        root->left = root->right = NULL;
        return root;
    }
    else if (key < root->data)
    {
        root->left = insert(root->left, key);
    }
    else
    {
        root->right = insert(root->right, key);
    }  
    return Balance(root); 
}

node* AVL_Tree::LLRot(node *temp)
{
    node *x = temp->left;
    node *y = x->right;
    x->right = temp;
    temp->left = y;
    return x;
}

node* AVL_Tree::RRRot(node *temp)
{
    node *x = temp->right;
    node *y = x->left;
    x->left = temp;
    temp->right = y;
    return x;
}

node* AVL_Tree::LRRot(node* temp)
{
    temp->left = RRRot(temp->left);
    return LLRot(temp);
}

node* AVL_Tree::RLRot(node* temp)
{
    temp->right = LLRot(temp->right);
    return RRRot(temp);
}

node* AVL_Tree::Balance(node *temp)
{
    int bf = BF(temp);
    if (bf == -2)
    {
        if (BF(temp->right) > 0)
        {
            return RLRot(temp);
        }
        else
        {
            return RRRot(temp);
        }
    }
    else if (bf == 2)
    {
        if (BF(temp->left) > 0)
        {
            return LLRot(temp);
        }
        else
        {
            return LRRot(temp);
        }
    }
    return temp;
}

int AVL_Tree::BF(node *temp)
{
    if (temp != NULL)
    {
        return (ht(temp->left) - ht(temp->right));
    }
    return 0;
}

int AVL_Tree::ht(node *temp)
{
    if (temp == NULL)
        return 0;
    else
    {
        return (max(ht(temp->left), ht(temp->right)) + 1);
    }
}

void AVL_Tree::Rec_Inorder()
{
    Rec_Inorder(root);
}

void AVL_Tree::Rec_Inorder(node *root)
{
    if (root != NULL)
    {
        Rec_Inorder(root->left);
        cout << root->data << "\t";
        Rec_Inorder(root->right);
    }
}

int main()
{
    AVL_Tree A1;
    A1.Create_AVL();
    A1.Rec_Inorder();
}
